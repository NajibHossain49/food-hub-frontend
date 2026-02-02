export interface CreateReviewData {
  mealId: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  mealId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  mealName?: string;
}
