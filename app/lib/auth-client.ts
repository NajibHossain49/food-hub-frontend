import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`
    : "http://localhost:4000/api/auth", // local development-এর জন্য fallback
});