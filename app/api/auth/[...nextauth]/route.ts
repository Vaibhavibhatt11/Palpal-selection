import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

// NextAuth must run on Node.js in production.
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
