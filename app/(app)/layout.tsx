// app/(app)/layout.tsx
import type { ReactNode } from "react";
import Navbar from "../Components/layout/Navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4">{children}</main>
    </div>
  );
}
