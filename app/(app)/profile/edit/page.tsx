"use client";

import { updateProfile } from "@/app/lib/api/users";
import { authClient } from "@/app/lib/auth-client";
import { updateProfileSchema } from "@/app/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type FormData = z.infer<typeof updateProfileSchema>;

function EditProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user.name || "",
      phone: session?.user.phone || "",
      avatarUrl: session?.user.avatarUrl || "",
      image: session?.user.image || "",
    },
  });

  // Auto-clear error message after 3 seconds
  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => {
        setSubmitError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitError]);

  useEffect(() => {
    if (!isPending && !session && !error) {
      router.replace("/Login");
    }
  }, [session, isPending, error, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error || !session?.user) {
    return null; // Redirect handled by useEffect
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
      router.push("/profile"); // Redirect back to profile
    } catch (err) {
      setSubmitError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Edit Profile
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              {...register("name")}
              className="w-full border border-gray-400 rounded-md px-3 py-2.5 
                         text-gray-900 placeholder-gray-400 
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                         focus:outline-none transition-colors duration-200"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1.5">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone
            </label>
            <input
              {...register("phone")}
              className="w-full border border-gray-400 rounded-md px-3 py-2.5 
                         text-gray-900 placeholder-gray-400 
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                         focus:outline-none transition-colors duration-200"
              placeholder="Your phone number"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1.5">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Avatar URL
            </label>
            <input
              {...register("avatarUrl")}
              className="w-full border border-gray-400 rounded-md px-3 py-2.5 
                         text-gray-900 placeholder-gray-400 
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                         focus:outline-none transition-colors duration-200"
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.avatarUrl && (
              <p className="text-red-600 text-sm mt-1.5">
                {errors.avatarUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Image URL
            </label>
            <input
              {...register("image")}
              className="w-full border border-gray-400 rounded-md px-3 py-2.5 
                         text-gray-900 placeholder-gray-400 
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                         focus:outline-none transition-colors duration-200"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="text-red-600 text-sm mt-1.5">
                {errors.image.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 
                       text-white rounded-md py-2.5 font-medium 
                       disabled:bg-orange-400 disabled:cursor-not-allowed 
                       transition-colors duration-200 mt-2"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
