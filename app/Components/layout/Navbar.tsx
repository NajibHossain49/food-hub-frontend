"use client";

import { authClient } from "@/app/lib/auth-client";
import {
  ChefHat,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!session?.user;
  const role = (session?.user as any)?.role;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/Login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Common links for all logged-in users
  const commonLinks = [{ href: "/profile", label: "Profile", icon: User }];

  // Role-specific links
  let roleLinks: { href: string; label: string; icon: any }[] = [];

  if (role === "PROVIDER") {
    roleLinks = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/meals", label: "My Meals", icon: ChefHat },
      { href: "/profile/orders", label: "My Orders", icon: ShoppingBag },
      { href: "/profile/reviews", label: "My Reviews", icon: User },
    ];
  } else if (role === "ADMIN") {
    roleLinks = [
      { href: "/users", label: "Users", icon: Users },
      { href: "/orders", label: "All Orders", icon: ShoppingBag },
      { href: "/categories", label: "Categories", icon: LayoutDashboard },
      { href: "/profile/reviews", label: "My Reviews", icon: User },
    ];
  } else if (role === "CUSTOMER") {
    roleLinks = [
      { href: "/profile/orders", label: "My Orders", icon: ShoppingBag },
      { href: "/profile/reviews", label: "My Reviews", icon: User },
    ];
  }

  if (!isLoggedIn) {
    return null; // No navbar on public/auth pages (controlled by layout)
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              FoodHub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Common links */}
            {commonLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors flex items-center gap-1"
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}

            {/* Role-specific links */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors flex items-center gap-1"
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Common links */}
            {commonLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Role-specific */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
