"use client";

import { authClient } from "@/app/lib/auth-client";
import {
  ChefHat,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isLoggedIn = !!session?.user;
  const role = (session?.user as any)?.role;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/Login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Navigation groups
  const navigationGroups = [
    {
      id: "explore",
      label: "Explore",
      items: [
        { id: "features", label: "Features", type: "scroll" },
        { href: "/meals", label: "Browse Meals", type: "link" },
        { id: "top-providers", label: "Top Providers", type: "scroll" },
        { id: "statistics", label: "Statistics", type: "scroll" },
      ],
    },
  ];

  // Role-based navigation groups
  let userMenuGroups: any[] = [];

  if (isLoggedIn) {
    if (role === "PROVIDER") {
      userMenuGroups = [
        {
          id: "provider-menu",
          label: "Provider",
          items: [
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/meals", label: "My Meals", icon: ChefHat },
            { href: "/profile/orders", label: "My Orders", icon: ShoppingBag },
            { href: "/profile/reviews", label: "My Reviews", icon: User },
          ],
        },
        {
          id: "account",
          label: "Account",
          items: [{ href: "/profile", label: "Profile", icon: User }],
        },
      ];
    } else if (role === "ADMIN") {
      userMenuGroups = [
        {
          id: "admin-menu",
          label: "Admin",
          items: [
            { href: "/users", label: "Users", icon: Users },
            { href: "/orders", label: "All Orders", icon: ShoppingBag },
            {
              href: "/categories",
              label: "Categories",
              icon: LayoutDashboard,
            },
            { href: "/profile/reviews", label: "My Reviews", icon: User },
          ],
        },
        {
          id: "account",
          label: "Account",
          items: [{ href: "/profile", label: "Profile", icon: User }],
        },
      ];
    } else if (role === "CUSTOMER") {
      userMenuGroups = [
        {
          id: "customer-menu",
          label: "My Account",
          items: [
            { href: "/profile", label: "Profile", icon: User },
            { href: "/profile/orders", label: "My Orders", icon: ShoppingBag },
            { href: "/profile/reviews", label: "My Reviews", icon: User },
          ],
        },
      ];
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-white shadow-md border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              FoodHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Public navigation dropdowns */}
            {navigationGroups.map((group) => (
              <div key={group.id} className="relative dropdown-container">
                <button
                  onClick={() => toggleDropdown(group.id)}
                  className="text-[var(--color-dark)] hover:text-[var(--color-orange-primary)] transition-colors duration-300 font-medium relative group flex items-center gap-1"
                >
                  {group.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openDropdown === group.id ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-orange-primary)] transition-all duration-300 group-hover:w-full"></span>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === group.id && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fadeIn">
                    {group.items.map((item: any) =>
                      item.type === "scroll" ? (
                        <button
                          key={item.id}
                          onClick={() => {
                            scrollToSection(item.id);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* User Menu Dropdowns - only when logged in */}
            {isLoggedIn &&
              userMenuGroups.map((group) => (
                <div key={group.id} className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown(group.id)}
                    className="text-[var(--color-dark)] hover:text-[var(--color-orange-primary)] transition-colors duration-300 font-medium relative group flex items-center gap-1"
                  >
                    {group.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdown === group.id ? "rotate-180" : ""
                      }`}
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-orange-primary)] transition-all duration-300 group-hover:w-full"></span>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === group.id && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fadeIn">
                      {group.items.map((item: any) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.icon && <item.icon size={18} />}
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {/* Login/Logout button */}
            {!isLoggedIn ? (
              <Link
                href="/Login"
                className="bg-[var(--color-orange-primary)] text-white px-6 py-2 rounded-full hover:bg-[var(--color-orange-dark)] transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
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
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Public navigation groups */}
            {navigationGroups.map((group) => (
              <div key={group.id} className="border-b border-gray-100 pb-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase">
                  {group.label}
                </div>
                {group.items.map((item: any) =>
                  item.type === "scroll" ? (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="block w-full text-left px-5 py-2 rounded-md text-base font-medium text-[var(--color-dark)] hover:text-[var(--color-orange-primary)] hover:bg-gray-50 transition-colors duration-300"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-5 py-2 rounded-md text-base font-medium text-[var(--color-dark)] hover:text-[var(--color-orange-primary)] hover:bg-gray-50 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            ))}

            {/* User menu groups - only when logged in */}
            {isLoggedIn &&
              userMenuGroups.map((group) => (
                <div
                  key={group.id}
                  className="border-b border-gray-100 pb-2 mt-2"
                >
                  <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase">
                    {group.label}
                  </div>
                  {group.items.map((item: any) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-5 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon size={18} />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}

            {/* Login/Logout button */}
            <div className="pt-2">
              {!isLoggedIn ? (
                <Link
                  href="/Login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-dark)] hover:text-[var(--color-orange-primary)] hover:bg-gray-50 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}