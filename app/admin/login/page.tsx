import { Suspense } from "react";
import AdminLoginForm from "../../../components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] px-4 py-10">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<div className="text-sm text-neutral-500">Loading...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
