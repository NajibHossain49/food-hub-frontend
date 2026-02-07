import { AdminUser } from "@/app/types/admin";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function getAllUsers(): Promise<AdminUser[]> {
  const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
    method: "GET",
    credentials: "include", // For auth cookies
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean,
): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user status");
  }
}

export interface AdminOrder {
  id: string;
  customerId: string;
  providerId: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string | null;
    email: string;
  };
  provider: {
    id: string;
    name: string;
  };
  items: Array<{
    id: string;
    mealId: string;
    quantity: number;
    price: number;
    subtotal: number;
    meal: {
      name: string;
    };
  }>;
}

export async function getAllOrders(): Promise<AdminOrder[]> {
  const response = await fetch(`${BACKEND_URL}/api/admin/orders`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  return response.json();
}

export interface AdminCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch categories");
  }

  return response.json();
}

export async function updateCategory(
  categoryId: string,
  data: { name: string },
): Promise<AdminCategory> {
  const response = await fetch(
    `${BACKEND_URL}/api/admin/categories/${categoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update category");
  }

  return response.json();
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const response = await fetch(
    `${BACKEND_URL}/api/admin/categories/${categoryId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete category");
  }
}

export async function createCategory(data: {
  name: string;
}): Promise<AdminCategory> {
  const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create category");
  }

  return response.json();
}

// Update user role (PATCH /api/admin/users/:id/role)
export async function updateUserRole(
  userId: string,
  role: string,
): Promise<void> {
  const response = await fetch(
    `${BACKEND_URL}/api/admin/users/${userId}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ role }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user role");
  }
}

// Update order status (PATCH /api/admin/orders/:id/status)
export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<void> {
  const response = await fetch(
    `${BACKEND_URL}/api/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update order status");
  }
}
