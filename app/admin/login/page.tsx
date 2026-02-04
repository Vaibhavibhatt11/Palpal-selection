import { Suspense } from "react";
import AdminLoginForm from "../../../components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#fff3f8] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-sm text-neutral-500">Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
