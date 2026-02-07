// app/(app)/dashboard/layout.tsx
import { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FoodHub - Your Ultimate Food Delivery Platform",
  description:
    "Discover, order, and enjoy delicious meals from top restaurants with FoodHub.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
}
