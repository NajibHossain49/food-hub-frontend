/* eslint-disable @next/next/no-img-element */
"use client";

import { getProviderMeals, ProviderMeal } from "@/app/lib/api/provider";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProviderMealsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [meals, setMeals] = useState<ProviderMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    async function fetchMeals() {
      if (!session?.user || (session.user as any).role !== "PROVIDER") return;

      try {
        const data = await getProviderMeals();
        setMeals(data);
      } catch (err: any) {
        setError(err.message || "Failed to load your meals");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending && (session?.user as any)?.role === "PROVIDER") {
      fetchMeals();
    }
  }, [session, isPending]);

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
      <div className="p-10 text-center text-red-600 text-xl font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Meals</h1>
        <Link
          href="/dashboard/meals/new"
          className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-sm"
        >
          + Add New Meal
        </Link>
      </div>

      {meals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-600">
          <p className="text-xl">You haven&apos;t added any meals yet.</p>
          <p className="mt-2">
            Click &rdquo;Add New Meal&rdquo; to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {meal.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {meal.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {meal.description || "No description"}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-orange-700">
                    ৳{meal.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(meal.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/meals/${meal.id}`}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white text-center rounded-md hover:bg-orange-700 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
