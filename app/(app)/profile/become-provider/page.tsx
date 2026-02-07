"use client";

import { createProviderProfile } from "@/app/lib/api/users";
import { authClient } from "@/app/lib/auth-client";
import { createProviderSchema } from "@/app/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

type FormData = z.infer<typeof createProviderSchema>;

function BecomeProviderPage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createProviderSchema),
  });

  useEffect(() => {
    if (!isPending && !session && !error) {
      router.replace("/Login");
    }
  }, [session, isPending, error, router]);

  if (isPending) {
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading... Please wait.
        </p>
      </div>
    </div>;
  }

  if (error || !session?.user) {
    return null; // Redirect handled by useEffect
  }

  // If user is already a provider → show message instead of form
  if ((session.user as any).role === "PROVIDER") {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Already a Provider
          </h1>
          <p className="text-gray-600 mb-8">
            You already have a provider profile. No additional action is needed
            here.
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createProviderProfile(data);
      toast.success("Provider profile created successfully");
      router.push("/profile");
    } catch (err) {
      setSubmitError("Failed to create provider profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Become a Provider
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Provider Name
            </label>
            <input
              {...register("name")}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.description && (
              <p className="text-red-600 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              {...register("address")}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.address && (
              <p className="text-red-600 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              {...register("phone")}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white rounded-md p-2 font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Provider Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BecomeProviderPage;
