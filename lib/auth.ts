import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./db";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const MAX_ATTEMPTS = 6;

async function checkRateLimit(email: string, ip: string) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - RATE_LIMIT_WINDOW_MINUTES * 60_000);
  const attempt = await prisma.loginAttempt.findUnique({
    where: { email_ip: { email, ip } }
  });

  if (!attempt) {
    await prisma.loginAttempt.create({
      data: { email, ip, count: 0, lastAttempt: now }
    });
    return { allowed: true, attemptCount: 0 };
  }

  if (attempt.lastAttempt < cutoff) {
    await prisma.loginAttempt.update({
      where: { email_ip: { email, ip } },
      data: { count: 0, lastAttempt: now }
    });
    return { allowed: true, attemptCount: 0 };
  }

  return { allowed: attempt.count < MAX_ATTEMPTS, attemptCount: attempt.count };
}

async function registerFailedAttempt(email: string, ip: string) {
  await prisma.loginAttempt.upsert({
    where: { email_ip: { email, ip } },
    update: { count: { increment: 1 }, lastAttempt: new Date() },
    create: { email, ip, count: 1, lastAttempt: new Date() }
  });
}

async function registerSuccess(email: string, ip: string) {
  await prisma.loginAttempt.update({
    where: { email_ip: { email, ip } },
    data: { count: 0, lastAttempt: new Date() }
  });
}

export const authOptions: NextAuthOptions = {
  // Keep admins signed in on mobile devices longer to avoid frequent logins.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  jwt: { maxAge: 60 * 60 * 24 * 30 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        const email = parsed.data.email.toLowerCase().trim();
        const password = parsed.data.password;
        const ip =
          req?.headers?.["x-forwarded-for"]?.toString().split(",")[0] ||
          req?.headers?.["x-real-ip"]?.toString() ||
          "unknown";

        try {
          const rate = await checkRateLimit(email, ip);
          if (!rate.allowed) {
            return null;
          }
        } catch {
          // If DB is unreachable, fail closed.
          return null;
        }

        let user = await prisma.adminUser.findUnique({
          where: { email }
        });
        if (!user) {
          const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
          const envPassword = process.env.ADMIN_PASSWORD;
          if (envEmail && envPassword && envEmail === email) {
            const passwordHash = await bcrypt.hash(envPassword, 10);
            try {
              user = await prisma.adminUser.create({
                data: { email, passwordHash }
              });
            } catch {
              await registerFailedAttempt(email, ip);
              return null;
            }
          } else {
            await registerFailedAttempt(email, ip);
            return null;
          }
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          await registerFailedAttempt(email, ip);
          return null;
        }

        await registerSuccess(email, ip);
        return { id: user.id, email: user.email };
      }
    })
  ],
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
