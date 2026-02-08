"use client";

import { getMyOrders } from "@/app/lib/api/orders";
import { authClient } from "@/app/lib/auth-client";
import { Order } from "@/app/types/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function OrdersPage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session && !error) {
      router.replace("/Login");
    }
  }, [session, isPending, error, router]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load session");
    }
  }, [error]);

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user) return;

      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/profile/orders/${order.id}`)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order #{order.id.slice(0, 8)}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "PENDING"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "CANCELED"
                          ? "bg-red-100 text-red-800"
                          : order.status === "DELIVERED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Provider: {order.providerName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Delivery: {order.deliveryAddress}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Payment: {order.paymentMethod}
                </p>

                <div className="border-t pt-4 mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Items
                  </h3>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-700 mb-1"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>৳{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>৳{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
