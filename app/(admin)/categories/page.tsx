"use client";

import {
  AdminCategory,
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "@/app/lib/api/admin";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal state
  const [createModal, setCreateModal] = useState<{
    isOpen: boolean;
    newName: string;
    submitting: boolean;
  }>({
    isOpen: false,
    newName: "",
    submitting: false,
  });

  // Edit modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    category: AdminCategory | null;
    newName: string;
    submitting: boolean;
  }>({
    isOpen: false,
    category: null,
    newName: "",
    submitting: false,
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
    submitting: boolean;
  }>({
    isOpen: false,
    categoryId: "",
    categoryName: "",
    submitting: false,
  });

  // Auth & role guard
  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/Login");
        return;
      }
      if (session.user.role !== "ADMIN") {
        router.replace("/profile");
        return;
      }
    }
  }, [session, isPending, router]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      if (!session?.user || session.user.role !== "ADMIN") return;

      try {
        const data = await getAdminCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "Failed to load categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending && session?.user?.role === "ADMIN") {
      fetchCategories();
    }
  }, [session, isPending]);

  // Open create modal
  const openCreateModal = () => {
    setCreateModal({ isOpen: true, newName: "", submitting: false });
  };

  // Handle create submit
  const handleCreateSubmit = async () => {
    const trimmedName = createModal.newName.trim();
    if (!trimmedName) return;

    setCreateModal((prev) => ({ ...prev, submitting: true }));

    try {
      const newCat = await createCategory({ name: trimmedName });

      // Optimistic add (prepend to list)
      setCategories((prev) => [newCat, ...prev]);

      setCreateModal({ isOpen: false, newName: "", submitting: false });
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    } finally {
      setCreateModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  // ... (keep your existing openEditModal, handleEditSubmit, openDeleteModal, handleDeleteConfirm functions)

  // Open edit modal
  const openEditModal = (category: AdminCategory) => {
    setEditModal({
      isOpen: true,
      category,
      newName: category.name,
      submitting: false,
    });
  };

  const handleEditSubmit = async () => {
    if (
      !editModal.category ||
      editModal.newName.trim() === editModal.category.name
    ) {
      setEditModal({ ...editModal, isOpen: false });
      return;
    }

    setEditModal({ ...editModal, submitting: true });

    try {
      const updated = await updateCategory(editModal.category.id, {
        name: editModal.newName.trim(),
      });

      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );

      setEditModal({
        isOpen: false,
        category: null,
        newName: "",
        submitting: false,
      });
    } catch (err: any) {
      alert(err.message || "Failed to update category");
    } finally {
      setEditModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Open delete modal
  const openDeleteModal = (category: AdminCategory) => {
    setDeleteModal({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name,
      submitting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal((prev) => ({ ...prev, submitting: true }));

    try {
      await deleteCategory(deleteModal.categoryId);

      setCategories((prev) =>
        prev.filter((c) => c.id !== deleteModal.categoryId),
      );

      setDeleteModal({
        isOpen: false,
        categoryId: "",
        categoryName: "",
        submitting: false,
      });
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setDeleteModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-red-600 text-center max-w-md">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Categories</h1>
            <p className="mt-1 text-sm text-gray-600">
              Total categories: {categories.length}
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            + Add New Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No categories found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cat.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cat.updatedAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(cat)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {createModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Category
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={createModal.newName}
                onChange={(e) =>
                  setCreateModal({ ...createModal, newName: e.target.value })
                }
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Korean, Mexican"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setCreateModal({ ...createModal, isOpen: false })
                }
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                disabled={createModal.submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={createModal.submitting || !createModal.newName.trim()}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  createModal.submitting || !createModal.newName.trim()
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {createModal.submitting ? "Creating..." : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (same as before) */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Category
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={editModal.newName}
                onChange={(e) =>
                  setEditModal({ ...editModal, newName: e.target.value })
                }
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter category name"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditModal({ ...editModal, isOpen: false })}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                disabled={editModal.submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editModal.submitting || !editModal.newName.trim()}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  editModal.submitting || !editModal.newName.trim()
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {editModal.submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the category{" "}
              <span className="font-semibold">
                &rdquo;{deleteModal.categoryName}&rdquo;
              </span>
              ?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteModal({ ...deleteModal, isOpen: false })
                }
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                disabled={deleteModal.submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteModal.submitting}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  deleteModal.submitting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleteModal.submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
