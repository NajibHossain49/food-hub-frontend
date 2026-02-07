export interface FeaturedMeal {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  providerName: string
}

export interface TopProvider {
  id: string
  name: string
  totalMeals: number
}

export interface AppStats {
  totalMeals: number
  totalProviders: number
  totalUsers: number
  totalReviews: number
}
