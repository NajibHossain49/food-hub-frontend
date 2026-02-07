export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// For user role update
export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

// For order status (adjust based on your actual statuses)
export type OrderStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
