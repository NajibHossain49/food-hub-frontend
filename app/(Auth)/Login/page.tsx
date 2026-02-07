import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-orange-600 text-lg font-medium">Loading...</div>
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}