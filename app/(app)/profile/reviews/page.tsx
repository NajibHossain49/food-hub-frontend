"use client";

import { deleteReview, getMyReviews } from "@/app/lib/api/reviews";
import { authClient } from "@/app/lib/auth-client";
import { Review } from "@/app/types/review";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function MyReviewsPage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!isPending && !session && !error) {
      router.replace("/Login");
    }
  }, [session, isPending, error, router]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load session");
    }
  }, [error]);

  useEffect(() => {
    async function fetchReviews() {
      if (!session?.user) return;

      try {
        const data = await getMyReviews();
        setReviews(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [session]);

  const handleDelete = async (id: string) => {
    setShowConfirmModal(false);
    setDeletingId(id);

    try {
      await deleteReview(id);
      toast.success("Review deleted successfully");

      // Refresh list
      const updated = await getMyReviews();
      setReviews(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          My Reviews
        </h1>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.mealName}
                    </p>
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.rating ? "text-orange-500" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={deletingId === review.id}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  {deletingId === review.id ? "Deleting..." : "Delete Review"}
                </button>

                {/* Confirmation Modal */}
                {showConfirmModal && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
                      <p className="text-gray-900 font-medium mb-4">
                        Are you sure you want to delete this review?
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setShowConfirmModal(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReviewsPage;
