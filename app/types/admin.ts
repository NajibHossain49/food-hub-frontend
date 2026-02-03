export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
