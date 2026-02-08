// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
//     ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`
//     : "http://localhost:4000/api/auth", // Local development URL

//   fetchOptions: {
//     credentials: "include",
//   },
// });

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  fetchOptions: {
    credentials: "include",
  },
});
