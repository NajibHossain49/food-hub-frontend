export interface OrderItem {
  mealId: string;
  quantity: number;
}

export interface CreateOrderData {
  deliveryAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

export interface OrderResponse {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  // Add other fields as per backend response
}

export interface OrderItem {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  providerId: string;
  providerName: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
