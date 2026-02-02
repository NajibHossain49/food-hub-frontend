"use client";

import { getOrderById } from "@/app/lib/api/orders";
import { authClient } from "@/app/lib/auth-client";
import { Order } from "@/app/types/order";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session && !error) {
      router.replace("/Login");
    }
  }, [session, isPending, error, router]);

  useEffect(() => {
    async function fetchOrder() {
      if (!session?.user || !id) return;

      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        router.push("/profile/orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, session, router]);

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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Order Details
        </h1>

        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Provider:</strong> {order.providerName}
          </p>
          <p>
            <strong>Total Amount:</strong> ৳{order.totalAmount}
          </p>
          <p>
            <strong>Delivery Address:</strong> {order.deliveryAddress}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Placed On:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated On:</strong>{" "}
            {new Date(order.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-md"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">Price: ৳{item.price}</p>
                </div>
                <p className="font-medium">৳{item.subtotal}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-8 w-full bg-orange-500 text-white py-2.5 rounded-md font-medium"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
}

export default OrderDetailPage;
