// app/(app)/layout.tsx
import { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "../Components/layout/Navbar";

export const metadata: Metadata = {
  title: "FoodHub - Your Ultimate Food Delivery Platform",
  description:
    "Discover, order, and enjoy delicious meals from top restaurants with FoodHub.",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4">{children}</main>
    </div>
  );
}
