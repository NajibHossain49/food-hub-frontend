/* eslint-disable @next/next/no-img-element */
"use client";

import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session && !error) {
      // not logged in → redirect to login
      router.replace("/Login");
    }
  }, [session, isPending, error, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-900 font-semibold mb-2">
              Error loading session
            </p>
            <p className="text-gray-600 text-sm">Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // will be redirected by useEffect
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 to-red-500 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Profile
            </h1>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-100 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-orange-400 to-red-400 flex items-center justify-center border-4 border-orange-100 shadow-md">
                  <span className="text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {user.name && (
                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  {user.name}
                </h2>
              )}
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Email Verified</p>
                  <div className="flex items-center">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center text-green-600">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-orange-600">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="text-gray-900 font-medium capitalize">
                    {user.role}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/profile/edit")}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Edit Profile
              </button>

              {user.role !== "PROVIDER" && (
                <button
                  onClick={() => router.push("/profile/become-provider")}
                  className="px-6 py-3 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                >
                  Become a Provider
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
