"use client";

import { getTopProviders } from "@/app/lib/api/home"; // ← your existing function
import type { TopProvider } from "@/types/api";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function TopProviders() {
  const [providers, setProviders] = useState<TopProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetchTopProviders() {
      try {
        const data = await getTopProviders();
        setProviders(data);
      } catch (err: any) {
        console.error("Failed to fetch top providers:", err);
        setError(err.message || "Could not load top providers");
      } finally {
        setLoading(false);
      }
    }

    fetchTopProviders();
  }, []);

  // Generate a color for each provider based on index
  const getProviderColor = (index: number) => {
    const colors = [
      "from-orange-400 to-red-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-emerald-500",
      "from-purple-400 to-pink-500",
      "from-yellow-400 to-orange-500",
    ];
    return colors[index % colors.length];
  };

  // Get initials from provider name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section id="top-providers" className="py-24 px-6 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-orange-primary)] font-bold uppercase tracking-wider text-sm mb-4"
          >
            Best Restaurants
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
          >
            Top Providers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Our most trusted restaurant partners serving delicious meals daily.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-[var(--color-cream)] rounded-3xl p-8 animate-pulse"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center text-red-600 py-12">
            <p className="text-xl font-semibold">{error}</p>
            <p className="mt-2 text-gray-600">Please try again later.</p>
          </div>
        )}

        {/* Providers Grid - Fully dynamic from API */}
        {!loading && !error && providers.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            <p className="text-xl font-medium">
              No top providers available right now.
            </p>
          </div>
        )}

        {!loading && !error && providers.length > 0 && (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {providers.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--color-cream)] rounded-3xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 cursor-pointer group"
              >
                {/* Provider Avatar */}
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${getProviderColor(index)} rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {getInitials(provider.name)}
                </div>

                {/* Provider Info */}
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-dark)]">
                  {provider.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <span className="text-[var(--color-orange-primary)] font-bold text-2xl">
                    {provider.totalMeals}
                  </span>
                  <span className="text-sm">Meals</span>
                </div>

                {/* Rating Stars */}
                <div className="mt-4 text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && providers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          ></motion.div>
        )}
      </div>
    </section>
  );
}
