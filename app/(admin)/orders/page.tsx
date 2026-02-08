"use client";

import Navigation from "@/app/Components/Navigation";
import {
  AdminOrder,
  getAllOrders,
  updateOrderStatus,
} from "@/app/lib/api/admin";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";           

export default function AdminOrdersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    orderId: string;
    currentStatus: string;
    newStatus: string;
  } | null>(null);

  // Role & auth guard
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

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user || (session.user as any).role !== "ADMIN") return;

      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load orders";
        setError(errorMessage);
        toast.error(errorMessage);           // Show toast on fetch error
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending && (session?.user as any)?.role === "ADMIN") {
      fetchOrders();
    }
  }, [session, isPending]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const currentOrder = orders.find((o) => o.id === orderId);
    if (!currentOrder) return;

    setConfirmModal({
      isOpen: true,
      orderId,
      currentStatus: currentOrder.status,
      newStatus,
    });
  };

  const confirmStatusChange = async () => {
    if (!confirmModal) return;

    const { orderId, newStatus } = confirmModal;
    setConfirmModal(null);
    setUpdatingOrderId(orderId);

    try {
      await updateOrderStatus(orderId, newStatus);

      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      toast.success(`Order status changed to ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update order status");   // Replace alert
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const cancelStatusChange = () => {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-red-600 text-center max-w-md">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="mt-5 min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="mt-1 text-sm text-gray-600">
              Total orders: {orders.length}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No orders found in the system.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.provider.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={updatingOrderId === order.id}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ৳{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                        <div className="text-xs mt-1">
                          {order.items.map((i) => i.meal.name).join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
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
                Change order status to{" "}
                <span className="font-semibold">{confirmModal.newStatus}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelStatusChange}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}