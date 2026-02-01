export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  providerId: string;
  providerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
