/* eslint-disable @next/next/no-img-element */
"use client";

import { getMealById } from "@/app/lib/api/meals";
import { authClient } from "@/app/lib/auth-client";
import { Meal } from "@/app/types/meal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MealDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!id) return;

    async function fetchMeal() {
      try {
        const data = await getMealById(id);
        setMeal(data);
      } catch (err) {
        console.error(err);
        router.push("/meals");
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Meal not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {meal.image && (
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-64 sm:h-96 object-cover"
          />
        )}

        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{meal.name}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-orange-600">
              ৳{meal.price}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {meal.category}
            </span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {meal.description}
          </p>

          <div className="text-sm text-gray-500 mb-8">
            Provided by <span className="font-medium">{meal.providerName}</span>
          </div>

          {session?.user && (
            <button className="w-full sm:w-auto px-8 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
