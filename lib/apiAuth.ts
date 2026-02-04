import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function requireAdmin(req?: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (req && secret) {
    try {
      const token = await getToken({ req: req as any, secret });
      if (token?.email) return true;
    } catch {
      // Fallback to session check below.
    }
  }
  try {
    const session = await getServerSession(authOptions);
    return Boolean(session?.user?.email);
  } catch {
    return false;
  }
}
