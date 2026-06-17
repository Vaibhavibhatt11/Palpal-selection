import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import AdminNav from "../../components/AdminNav";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {session?.user?.email ? <AdminNav /> : null}
        {children}
      </div>
    </div>
  );
}
