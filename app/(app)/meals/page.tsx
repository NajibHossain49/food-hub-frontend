"use client";

import Navigation from "@/app/Components/Navigation";
import { getCategories, getMeals } from "@/app/lib/api/meals";
import { authClient } from "@/app/lib/auth-client";
import { Category, Meal } from "@/app/types/meal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Add this import

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session } = authClient.useSession();

  useEffect(() => {
    async function loadData() {
      try {
        const cats = await getCategories();
        setCategories(cats);

        const params = selectedCategory
          ? { category: selectedCategory }
          : undefined;
        const mealData = await getMeals(params);
        setMeals(mealData);
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to load meals or categories";
        console.error(err);
        toast.error(errorMessage); // Show toast on loading error
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  const handlePlaceOrder = (mealId: string) => {
    if (session?.user) {
      // User is logged in, go directly to checkout
      router.push(`/checkout?mealId=${mealId}`);
    } else {
      // User not logged in, redirect to login with return URL
      const returnUrl = encodeURIComponent(`/checkout?mealId=${mealId}`);
      router.push(`/Login?returnUrl=${returnUrl}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading delicious meals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="mt-2.5 min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-3">
              All Meals
            </h1>
            <p className="text-gray-600 text-lg">
              Discover your next favorite dish
            </p>
          </div>

          {/* Filter */}
          <div className="mb-12 max-w-md mx-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm hover:border-gray-300 transition-all bg-white font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Meals Grid */}
          {meals.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
                <svg
                  className="w-20 h-20 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xl text-gray-600 font-medium">
                  No meals found.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group border border-gray-100"
                >
                  {/* Image Container */}
                  {meal.image && (
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                        <span className="text-sm font-bold text-orange-600">
                          ৳{meal.price}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 flex-grow pr-2 leading-tight">
                        {meal.name}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow line-clamp-3">
                      {meal.description}
                    </p>

                    {/* Category & Provider */}
                    <div className="space-y-2 mb-5 pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm">
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium text-xs">
                          {meal.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1.5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {meal.providerName}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 mt-auto">
                      <button
                        onClick={() => router.push(`/meals/${meal.id}`)}
                        className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 font-semibold text-sm flex items-center justify-center group/btn shadow-sm"
                      >
                        <span>View Details</span>
                        <svg
                          className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handlePlaceOrder(meal.id)}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
