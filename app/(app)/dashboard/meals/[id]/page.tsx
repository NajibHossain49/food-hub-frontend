/* eslint-disable @next/next/no-img-element */
"use client";

import {
  deleteMeal,
  getProviderMealById,
  ProviderMeal,
  updateMeal,
} from "@/app/lib/api/provider";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Add this import

export default function MealDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [meal, setMeal] = useState<ProviderMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    formData: {
      name: string;
      description: string;
      price: string;
      image: string;
      categoryId: string;
    };
    submitting: boolean;
  }>({
    isOpen: false,
    formData: {
      name: "",
      description: "",
      price: "",
      image: "",
      categoryId: "",
    },
    submitting: false,
  });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || (session.user as any).role !== "PROVIDER") {
        router.replace("/profile");
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchMeal() {
      if (!id || !session?.user || (session.user as any).role !== "PROVIDER")
        return;

      try {
        const data = await getProviderMealById(id as string);
        setMeal(data);

        // Pre-fill edit form
        setEditModal((prev) => ({
          ...prev,
          formData: {
            name: data.name,
            description: data.description || "",
            price: data.price.toString(),
            image: data.image || "",
            categoryId: data.categoryId || "",
          },
        }));
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load meal details";
        setError(errorMessage);
        toast.error(errorMessage); // Show toast on fetch error
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending && (session?.user as any)?.role === "PROVIDER") {
      fetchMeal();
    }
  }, [id, session, isPending]);

  const openEditModal = () => {
    setEditModal((prev) => ({ ...prev, isOpen: true }));
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditModal((prev) => ({
      ...prev,
      formData: { ...prev.formData, [name]: value },
    }));
  };

  const handleEditSubmit = async () => {
    setEditModal((prev) => ({ ...prev, submitting: true }));

    try {
      const payload = {
        name: editModal.formData.name.trim(),
        description: editModal.formData.description.trim() || undefined,
        price: Number(editModal.formData.price),
        image: editModal.formData.image.trim() || undefined,
        categoryId: editModal.formData.categoryId.trim() || undefined,
      };

      const updated = await updateMeal(id as string, payload);

      setMeal(updated);

      setEditModal({
        isOpen: false,
        formData: {
          name: "",
          description: "",
          price: "",
          image: "",
          categoryId: "",
        },
        submitting: false,
      });

      toast.success("Meal updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update meal"); // Replace alert
    } finally {
      setEditModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!meal) return;
    setDeleteModalOpen(false); // close immediately

    try {
      await deleteMeal(meal.id);
      toast.success("Meal deleted successfully");
      router.push("/dashboard/meals");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete meal"); // Replace alert
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl text-red-600">{error || "Meal not found"}</p>
        <Link
          href="/dashboard/meals"
          className="mt-4 inline-block text-orange-600 hover:underline"
        >
          ← Back to Meals
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <Link
        href="/dashboard/meals"
        className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6 font-medium"
      >
        ← Back to My Meals
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {meal.image && (
            <div className="h-64 md:h-full overflow-hidden">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {meal.name}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="text-4xl font-bold text-orange-700">
                ৳{meal.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                Created: {new Date(meal.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {meal.description || "No description provided."}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={openEditModal}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
              >
                Edit Meal
              </button>
              <button
                onClick={openDeleteModal}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
              >
                Delete Meal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 my-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Edit Meal
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={editModal.formData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={editModal.formData.description}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (৳) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={editModal.formData.price}
                  onChange={handleEditChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={editModal.formData.image}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {editModal.formData.image && (
                  <div className="mt-3">
                    <img
                      src={editModal.formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category ID
                </label>
                <input
                  type="text"
                  name="categoryId"
                  value={editModal.formData.categoryId}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Keep current or change"
                />
              </div> */}
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => setEditModal({ ...editModal, isOpen: false })}
                className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={editModal.submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={
                  editModal.submitting ||
                  !editModal.formData.name.trim() ||
                  !editModal.formData.price ||
                  isNaN(Number(editModal.formData.price))
                }
                className={`px-6 py-2.5 rounded-md text-white font-medium ${
                  editModal.submitting ||
                  !editModal.formData.name.trim() ||
                  !editModal.formData.price ||
                  isNaN(Number(editModal.formData.price))
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {editModal.submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the meal{" "}
              <span className="font-semibold">
                &rdquo;{meal?.name || "this meal"}&rdquo;
              </span>
              ?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
