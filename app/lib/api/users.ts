import { CreateProviderData, UpdateProfileData } from "@/app/types/user";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function updateProfile(data: UpdateProfileData) {
  const response = await fetch(`${BACKEND_URL}/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Required for auth cookies
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}

export async function createProviderProfile(data: CreateProviderData) {
  const response = await fetch(`${BACKEND_URL}/api/users/me/provider-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Required for auth cookies
  });

  if (!response.ok) {
    throw new Error("Failed to create provider profile");
  }

  return response.json();
}
