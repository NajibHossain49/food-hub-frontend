import { CreateReviewData, Review } from "@/app/types/review";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function createReview(data: CreateReviewData): Promise<Review> {
  const response = await fetch(`/api/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create review");
  }

  return response.json();
}

export async function getReviewsForMeal(mealId: string): Promise<Review[]> {
  const response = await fetch(`/api/reviews/meal/${mealId}`, {
    method: "GET",
    credentials: "include", // even though public, include for consistency
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}

export async function getMyReviews(): Promise<Review[]> {
  const response = await fetch(`/api/reviews/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my reviews");
  }

  return response.json();
}

export async function deleteReview(id: string): Promise<void> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete review");
  }
}
