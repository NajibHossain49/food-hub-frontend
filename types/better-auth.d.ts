import { DefaultSession } from "better-auth";

declare module "better-auth" {
  interface User {
    role: string;       // "CUSTOMER" | "PROVIDER" | "ADMIN"
    isActive: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      image?: string | null;
      role: string;
      isActive: boolean;
    } & DefaultSession["user"];
  }
}