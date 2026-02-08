/* eslint-disable @next/next/no-img-element */
"use client";

import { getMealById } from "@/app/lib/api/meals";
import { createReview, getReviewsForMeal } from "@/app/lib/api/reviews";
import { authClient } from "@/app/lib/auth-client";
import { createReviewSchema } from "@/app/lib/schemas/review";
import { Meal } from "@/app/types/meal";
import { Review } from "@/app/types/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type ReviewFormData = z.infer<typeof createReviewSchema>;

export default function MealDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const {
    register: registerReview,
    handleSubmit: handleReviewSubmit,
    formState: { errors: reviewErrors },
    reset: resetReviewForm,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      mealId: id as string,
      rating: 5,
      comment: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    async function fetchMeal() {
      try {
        const data = await getMealById(id);
        setMeal(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load meal details");
        router.push("/meals");
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [id, router]);

  // Load reviews
  useEffect(() => {
    async function loadReviews() {
      if (!id) return;

      try {
        const data = await getReviewsForMeal(id);
        setReviews(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    }

    loadReviews();
  }, [id]);

  const onReviewSubmit = async (data: ReviewFormData) => {
    try {
      await createReview(data);
      toast.success("Review submitted successfully", { duration: 3000 });

      // Refresh reviews
      const updated = await getReviewsForMeal(id as string);
      setReviews(updated);

      resetReviewForm({
        mealId: id as string,
        rating: 5,
        comment: "",
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit review";
      toast.error(errorMessage, { duration: 3000 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-50">
        <div className="text-gray-600">Meal not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Content - Horizontal Layout */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            {meal.image && (
              <div className="relative h-64 lg:h-auto lg:min-h-[400px]">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Details Section */}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-3 w-fit">
                {meal.category}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {meal.name}
              </h1>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {meal.description}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                by{" "}
                <span className="font-medium text-gray-700">
                  {meal.providerName}
                </span>
              </p>

              <div className="text-2xl font-bold text-orange-600 mb-6">
                ৳{meal.price}
              </div>

              {session?.user && (
                <button className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>

          {loadingReviews ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600 italic">
              No reviews yet. Be the first to review this meal!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-900">
                      {review.userName}
                    </p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < review.rating ? "text-orange-500" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          {session?.user && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Write Your Review
              </h3>

              <form onSubmit={handleReviewSubmit(onReviewSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* Rating Input */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      Rating
                    </label>
                    <input
                      type="number"
                      {...registerReview("rating", { valueAsNumber: true })}
                      min={1}
                      max={5}
                      step={1}
                      className="no-spinner w-full border text-gray-700 border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {reviewErrors.rating && (
                      <p className="text-red-600 text-xs mt-1">
                        {reviewErrors.rating.message}
                      </p>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="md:col-span-3">
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      Your Comment
                    </label>
                    <input
                      type="text"
                      {...registerReview("comment")}
                      className="w-full border text-gray-700 border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Share your experience..."
                    />
                    {reviewErrors.comment && (
                      <p className="text-red-600 text-xs mt-1">
                        {reviewErrors.comment.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
