import { Category, Meal } from "@/app/types/meal";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function getMeals(filters: Record<string, string> = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `/api/meals${queryParams ? `?${queryParams}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch meals: ${response.statusText}`);
  }

  return response.json() as Promise<Meal[]>;
}

export async function getMealById(id: string) {
  const response = await fetch(`/api/meals/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch meal: ${response.statusText}`);
  }

  return response.json() as Promise<Meal>;
}

export async function getCategories() {
  const response = await fetch(`/api/meals/categories`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json() as Promise<Category[]>;
}

interface FeaturedMeal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export async function getFeaturedMeals(): Promise<FeaturedMeal[]> {
  const response = await fetch(`/api/home/featured-meals`, {
    method: "GET",
    credentials: "include", // if auth is needed (optional for public endpoint)
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch featured meals");
  }

  return response.json();
}
