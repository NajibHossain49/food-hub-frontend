"use client";

import {
  getProviderProfile,
  ProviderProfile,
  updateProviderProfile,
} from "@/app/lib/api/provider";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Add this import

export default function ProviderProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auth & role guard
  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/Login");
        return;
      }
      if ((session.user as any).role !== "PROVIDER") {
        router.replace("/profile");
        return;
      }
    }
  }, [session, isPending, router]);

  // Load provider profile
  useEffect(() => {
    async function loadProfile() {
      if (!session?.user || (session.user as any).role !== "PROVIDER") return;

      try {
        const data = await getProviderProfile();
        setProfile(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          phone: data.phone || "",
        });
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
      loadProfile();
    }
  }, [session, isPending]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Only send changed fields (optional optimization)
      const payload: Partial<typeof formData> = {};
      if (formData.name !== profile?.name)
        payload.name = formData.name || undefined;
      if (formData.description !== profile?.description)
        payload.description = formData.description || undefined;
      if (formData.address !== profile?.address)
        payload.address = formData.address || undefined;
      if (formData.phone !== profile?.phone)
        payload.phone = formData.phone || undefined;

      if (Object.keys(payload).length === 0) {
        setSuccess(true);
        setIsEditing(false);
        return;
      }

      const updated = await updateProviderProfile(payload);
      setProfile(updated);
      setSuccess(true);
      setIsEditing(false);

      toast.success("Profile updated successfully");

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage); // Show toast on update error
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "PROVIDER") return null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-red-600 max-w-md text-center">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 lg:px-10">
      <h1 className="text-2xl text-center font-bold text-gray-900 mb-8">
        Provider Profile
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Business Details
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md text-center">
            Profile updated successfully!
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                placeholder="Tell customers about your business..."
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-4 pt-6 justify-center">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  submitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSuccess(false);
                  setError(null);
                  // Reset form to original values
                  if (profile) {
                    setFormData({
                      name: profile.name || "",
                      description: profile.description || "",
                      address: profile.address || "",
                      phone: profile.phone || "",
                    });
                  }
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-sm text-gray-600 block">Business Name</span>
              <p className="text-xl font-bold text-orange-700">
                {profile?.name || "Not set"}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600 block">Description</span>
              <p className="text-gray-700 leading-relaxed">
                {profile?.description || "No description provided yet."}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600 block">Address</span>
              <p className="text-gray-700">{profile?.address || "Not set"}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600 block">Phone Number</span>
              <p className="text-gray-700">{profile?.phone || "Not set"}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600 block">
                Profile Created
              </span>
              <p className="text-gray-700">
                {profile
                  ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
                      dateStyle: "long",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
