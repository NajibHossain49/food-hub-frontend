const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export interface AppStats {
  totalMeals: number;
  totalProviders: number;
  totalUsers: number;
  totalReviews: number;
}

export async function getAppStats(): Promise<AppStats> {
  const response = await fetch(`${BACKEND_URL}/api/home/stats`, {
    method: "GET",
    credentials: "include", // optional, remove if public
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch app statistics");
  }

  return response.json();
}

export interface TopProvider {
  id: string;
  name: string;
  totalMeals: number;
}

export async function getTopProviders(): Promise<TopProvider[]> {
  const response = await fetch(`${BACKEND_URL}/api/home/top-providers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch top providers");
  }

  return response.json();
}
