/* eslint-disable @next/next/no-img-element */
"use client";

import { getCategories } from "@/app/lib/api/meals";
import { createProviderMeal } from "@/app/lib/api/provider";
import { authClient } from "@/app/lib/auth-client";
import { Category } from "@/app/types/meal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Add this import

export default function NewMealPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    isAvailable: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || (session.user as any).role !== "PROVIDER") {
        router.replace("/profile");
      }
    }
  }, [session, isPending, router]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load categories";
        setError(errorMessage);
        toast.error(errorMessage); // Show toast on fetch error
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      // Basic client validation
      if (!formData.name.trim()) throw new Error("Name is required");
      if (
        !formData.price ||
        isNaN(Number(formData.price)) ||
        Number(formData.price) <= 0
      ) {
        throw new Error("Valid price is required");
      }
      if (!formData.categoryId) throw new Error("Please select a category");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: Number(formData.price),
        image: formData.image.trim() || undefined,
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
      };

      await createProviderMeal(payload);

      setSuccess(true);
      toast.success("Meal created successfully");

      setTimeout(() => {
        router.push("/dashboard/meals");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create meal";
      setError(errorMessage);
      toast.error(errorMessage); // Show toast on submit error
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "PROVIDER") return null;

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Add New Meal
      </h1>

      <div className="bg-white rounded-xl shadow-md p-8">
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            Meal created successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Chicken Biryani"
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
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Describe ingredients, taste, portion..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (৳) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 no-spinner"
              placeholder="e.g. 320.00"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com/meal.jpg"
            />
            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            {loadingCategories ? (
              <div className="text-gray-500">Loading categories...</div>
            ) : (
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Available for order
            </label>
          </div>

          {/* Submit */}
          <div className="pt-6 flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingCategories}
              className={`px-6 py-2.5 rounded-md text-white font-medium ${
                submitting || loadingCategories
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {submitting ? "Creating..." : "Create Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
