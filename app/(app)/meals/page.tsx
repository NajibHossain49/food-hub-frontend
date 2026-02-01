/* eslint-disable @next/next/no-img-element */
"use client";

import { getCategories, getMeals } from "@/app/lib/api/meals";
import { authClient } from "@/app/lib/auth-client";
import { Category, Meal } from "@/app/types/meal";
import { useEffect, useState } from "react";

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    async function loadData() {
      try {
        const cats = await getCategories();
        setCategories(cats);

        const params = selectedCategory ? { category: selectedCategory } : {};
        const mealData = await getMeals(params);
        setMeals(mealData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          All Meals
        </h1>

        {/* Filter */}
        <div className="mb-10 max-w-xs mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full border border-gray-300 rounded-md py-2.5 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
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
          <p className="text-center text-lg text-gray-600 py-12">
            No meals found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                {meal.image && (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {meal.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {meal.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">
                      ৳{meal.price}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {meal.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    by {meal.providerName}
                  </p>

                  {session?.user && (
                    <button className="mt-5 w-full bg-orange-600 text-white py-2.5 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium">
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
