import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-orange-600 text-lg font-medium">Loading checkout...</div>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}