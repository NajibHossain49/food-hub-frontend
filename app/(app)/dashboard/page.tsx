"use client";

import { getProviderProfile, ProviderProfile } from "@/app/lib/api/provider";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Add this import

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth & role guard
  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/Login");
        return;
      }

      if ((session.user as any).role !== "PROVIDER") {
        router.replace("/profile"); // or show message "Become a provider first"
        return;
      }
    }
  }, [session, isPending, router]);

  // Fetch provider profile
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user || (session.user as any).role !== "PROVIDER") return;

      try {
        const data = await getProviderProfile();
        setProfile(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load provider profile";
        setError(errorMessage);
        toast.error(errorMessage); // Show toast on fetch error
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending && (session?.user as any)?.role === "PROVIDER") {
      fetchProfile();
    }
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "PROVIDER") {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="bg-white p-8 rounded-xl shadow-xl text-red-600 text-center max-w-md">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="mt-2 text-orange-100">
            Welcome back, {session.user.name || "Provider"}
          </p>
        </div>

        <div className="p-6 lg:p-8">
          {/* Basic User Info from session */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium text-gray-900">
                  {session.user.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-900">
                  {session.user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-medium text-green-700">Provider</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joined</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(session.user.createdAt || "").toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Provider Profile Info */}
          {profile ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Provider Profile
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {profile.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg text-gray-900">
                      {profile.phone || "Not set"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-lg text-gray-900">
                      {profile.address || "Not set"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-lg text-gray-700">
                      {profile.description || "No description yet"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Profile created:{" "}
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              No provider profile found. Please contact support.
            </div>
          )}

          {/* Quick links / next actions */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard/meals")}
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Manage Meals
            </button>
            <button
              onClick={() => router.push("/dashboard/orders")}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              View Orders
            </button>
            <button
              onClick={() => router.push("/dashboard/profile/edit")}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Edit Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
