// app/(app)/layout.tsx
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
}
