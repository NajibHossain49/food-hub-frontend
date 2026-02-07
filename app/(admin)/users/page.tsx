"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { getAllUsers, updateUserStatus, updateUserRole } from "@/app/lib/api/admin";
import { AdminUser } from "@/app/types/admin";
import Navigation from "@/app/Components/Navigation";

function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    currentStatus: boolean;
    action: "status" | "role";
    newRole?: string;
  } | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/Login");
        return;
      }

      if ((session.user as any).role !== "ADMIN") {
        router.replace("/profile");
        return;
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchUsers() {
      if (!session?.user || (session.user as any).role !== "ADMIN") return;

      try {
        const data = await getAllUsers();
        const filtered = data.filter((u) => u.id !== session.user.id);
        setUsers(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending && (session?.user as any)?.role === "ADMIN") {
      fetchUsers();
    }
  }, [session, isPending]);

  const handleToggleActive = (userId: string, currentStatus: boolean) => {
    setConfirmModal({
      isOpen: true,
      userId,
      currentStatus,
      action: "status",
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setConfirmModal({
      isOpen: true,
      userId,
      currentStatus: false, // not used for role
      action: "role",
      newRole,
    });
  };

  const confirmAction = async () => {
    if (!confirmModal) return;

    const { userId, currentStatus, action, newRole } = confirmModal;
    setConfirmModal(null);
    setUpdatingUserId(userId);

    try {
      if (action === "status") {
        const newStatus = !currentStatus;
        await updateUserStatus(userId, newStatus);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: newStatus } : u))
        );
      } else if (action === "role" && newRole) {
        await updateUserRole(userId, newRole);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as "CUSTOMER" | "PROVIDER" | "ADMIN" } : u))
        );
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const cancelAction = () => {
    setConfirmModal(null);
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <Navigation />
      <div className="mt-5 min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 text-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">All Users</h1>

          {users.length === 0 ? (
            <p className="text-center text-gray-700 font-medium">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-200 text-gray-900">
                    <th className="p-3 text-left font-semibold">Name</th>
                    <th className="p-3 text-left font-semibold">Email</th>
                    <th className="p-3 text-left font-semibold">Role</th>
                    <th className="p-3 text-left font-semibold">Active</th>
                    <th className="p-3 text-left font-semibold">Joined</th>
                    <th className="p-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 text-gray-800">{user.name || "—"}</td>
                      <td className="p-3 text-gray-800">{user.email}</td>
                      <td className="p-3 text-gray-800">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updatingUserId === user.id}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="PROVIDER">Provider</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            user.isActive
                              ? "bg-green-100 text-green-900"
                              : "bg-red-100 text-red-900"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={updatingUserId === user.id}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            updatingUserId === user.id
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : user.isActive
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {updatingUserId === user.id
                            ? "Updating..."
                            : user.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Custom Confirmation Modal */}
        {confirmModal?.isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Confirm Action
              </h2>
              <p className="text-gray-700 mb-6">
                {confirmModal.action === "status" ? (
                  <>
                    Are you sure you want to{" "}
                    <span className="font-semibold">
                      {confirmModal.currentStatus ? "deactivate" : "activate"}
                    </span>{" "}
                    this user?
                  </>
                ) : (
                  <>
                    Change role to{" "}
                    <span className="font-semibold">{confirmModal.newRole}</span>?
                  </>
                )}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelAction}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                    confirmModal.action === "status"
                      ? confirmModal.currentStatus
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  {confirmModal.action === "status"
                    ? confirmModal.currentStatus
                      ? "Deactivate"
                      : "Activate"
                    : "Change Role"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminUsersPage;