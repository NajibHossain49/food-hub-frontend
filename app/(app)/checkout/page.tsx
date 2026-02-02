"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { getMealById } from "@/app/lib/api/meals";
import { createOrder } from "@/app/lib/api/orders";
import { authClient } from "@/app/lib/auth-client";
import { createOrderSchema } from "@/app/lib/schemas/order";
import toast from "react-hot-toast";
import { z } from "zod";

type FormData = z.infer<typeof createOrderSchema>;

function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealIdFromUrl = searchParams.get("mealId");

  const { data: session, isPending, error } = authClient.useSession();

  const [meal, setMeal] = useState<any>(null);
  const [loadingMeal, setLoadingMeal] = useState(!!mealIdFromUrl);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      deliveryAddress: "",
      paymentMethod: "Cash on Delivery",
      items: [],
    },
  });

  // Watch quantity for real-time total calculation
  const quantity = watch("items.0.quantity") || 1;

  useEffect(() => {
    if (!isPending && !session && !error) {
      router.replace("/Login");
    }
  }, [session, isPending, error, router]);

  // Fetch meal details
  useEffect(() => {
    async function fetchMeal() {
      if (!mealIdFromUrl) {
        toast.error("No meal selected");
        router.push("/meals");
        setLoadingMeal(false);
        return;
      }

      try {
        const data = await getMealById(mealIdFromUrl);
        setMeal(data);

        // Pre-fill form with this meal and default quantity 1
        setValue("items", [
          {
            mealId: data.id,
            quantity: 1,
          },
        ]);
      } catch (err) {
        toast.error("Failed to load meal");
        router.push("/meals");
      } finally {
        setLoadingMeal(false);
      }
    }

    fetchMeal();
  }, [mealIdFromUrl, setValue, router]);

  if (isPending || loadingMeal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="text-orange-600 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (error || !session?.user) {
    return null;
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-linear-to-br from-orange-50 to-red-50">
        Meal not found
      </div>
    );
  }

  const totalAmount = meal.price * quantity;

  const onSubmit = async (data: FormData) => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createOrder(data);
      toast.success("Order placed successfully");
      router.push("/profile");
    } catch (err) {
      setSubmitError("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Place Your Order
        </h1>

        {/* Main Grid Layout - Horizontal */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Meal Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-fit sticky top-8">
            {meal.image && (
              <div className="w-full h-72 overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {meal.name}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {meal.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">
                    Price per item
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    ৳{meal.price}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500 block mb-1">
                    Category
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {meal.category}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Provided by</span>
                <p className="text-base font-semibold text-gray-800 mt-1">
                  {meal.providerName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Order Details
            </h2>

            <form
              onSubmit={handleSubmit(() => setShowConfirmModal(true))}
              className="space-y-6"
            >
              {/* Quantity and Total - Horizontal */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register("items.0.quantity", { valueAsNumber: true })}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all no-spinner"
                  />
                  {errors.items?.[0]?.quantity && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.items[0].quantity.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount
                  </label>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-3 h-[50px] flex items-center">
                    <span className="text-2xl font-bold text-orange-600">
                      ৳{totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  {...register("deliveryAddress")}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter your delivery address here"
                />
                {errors.deliveryAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.deliveryAddress.message}
                  </p>
                )}
              </div>

              {/* Payment Method - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  {...register("paymentMethod")}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
                {errors.paymentMethod && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Order Summary Box */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-5 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium text-gray-900">
                      {meal.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium text-gray-900">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per item:</span>
                    <span className="font-medium text-gray-900">
                      ৳{meal.price}
                    </span>
                  </div>
                  <div className="border-t border-orange-300 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-orange-600 text-lg">
                      ৳{totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-lg hover:from-orange-700 hover:to-red-700 disabled:from-orange-400 disabled:to-red-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Confirm Your Order
              </h3>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-5 mb-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meal:</span>
                  <span className="font-semibold text-gray-900">
                    {meal.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold text-gray-900">
                    × {quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-orange-200">
                  <span className="font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="font-bold text-orange-600 text-xl">
                    ৳{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:from-orange-400 disabled:to-red-400 transition-all font-semibold shadow-lg"
              >
                {isSubmitting ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
