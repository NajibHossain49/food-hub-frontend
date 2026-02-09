const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export interface ProviderProfile {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getProviderProfile(): Promise<ProviderProfile> {
  const response = await fetch(`/api/provider/profile`, {
    method: "GET",
    credentials: "include", // sends auth cookie
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch provider profile");
  }

  return response.json();
}

export async function updateProviderProfile(
  profileData: Partial<ProviderProfile>,
): Promise<ProviderProfile> {
  const response = await fetch(`/api/provider/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // sends auth cookie
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update provider profile");
  }

  return response.json();
}

export interface ProviderMeal {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  providerId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getProviderMeals(): Promise<ProviderMeal[]> {
  const response = await fetch(`/api/provider/meals`, {
    method: "GET",
    credentials: "include", // sends auth cookie
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch provider meals");
  }

  return response.json();
}

export async function getProviderMealById(
  mealId: string,
): Promise<ProviderMeal> {
  const response = await fetch(`/api/provider/meals/${mealId}`, {
    method: "GET",
    credentials: "include", // sends auth cookie
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch provider meal");
  }

  return response.json();
}

export async function createProviderMeal(
  mealData: Partial<ProviderMeal>,
): Promise<ProviderMeal> {
  const response = await fetch(`/api/provider/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // sends auth cookie
    body: JSON.stringify(mealData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create provider meal");
  }

  return response.json();
}

export async function updateMeal(
  mealId: string,
  mealData: Partial<ProviderMeal>,
): Promise<ProviderMeal> {
  const response = await fetch(`/api/provider/meals/${mealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // sends auth cookie
    body: JSON.stringify(mealData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update provider meal");
  }

  return response.json();
}

export async function deleteMeal(mealId: string): Promise<void> {
  const response = await fetch(`/api/provider/meals/${mealId}`, {
    method: "DELETE",
    credentials: "include", // sends auth cookie
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete provider meal");
  }
}
