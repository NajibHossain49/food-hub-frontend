export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  role: string;
  image?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  image?: string;
}

export interface CreateProviderData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}
