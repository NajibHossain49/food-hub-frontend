import { CreateOrderData, Order, OrderResponse } from "@/app/types/order";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function createOrder(
  data: CreateOrderData,
): Promise<OrderResponse> {
  const response = await fetch(`/api/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.statusText}`);
  }

  return response.json();
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await fetch(`/api/orders/`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export async function getOrderById(id: string): Promise<Order> {
  const response = await fetch(`/api/orders/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return response.json();
}
