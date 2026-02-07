"use client";

import { getAppStats } from "@/app/lib/api/home";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AppStatistics() {
  const [stats, setStats] = useState<{
    totalMeals: number;
    totalProviders: number;
    totalUsers: number;
    totalReviews: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAppStats();
        setStats(data);
      } catch (err: any) {
        console.error("Failed to fetch stats:", err);
        setError(err.message || "Could not load statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Animated counter component
  const AnimatedCounter = ({
    value,
    suffix = "+",
  }: {
    value: number;
    suffix?: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value, isInView]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  };

  return (
    <section
      id="statistics"
      className="py-24 px-6 bg-gradient-to-br from-[var(--color-orange-primary)] to-[var(--color-orange-dark)] text-white relative overflow-hidden"
      ref={ref}
    >
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-white/80 font-bold uppercase tracking-wider text-sm mb-4"
          >
            Our Achievements
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
          >
            App Statistics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/90 leading-relaxed"
          >
            Numbers that showcase our commitment to delivering excellence every
            single day.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 animate-pulse"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl mb-6 mx-auto" />
                <div className="h-8 bg-white/20 rounded w-3/4 mx-auto mb-4" />
                <div className="h-4 bg-white/20 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-xl font-semibold">{error}</p>
            <p className="mt-2 text-white/80">Please try again later.</p>
          </div>
        )}

        {/* Statistics Grid - Fully dynamic from API */}
        {!loading && !error && stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-400 border border-white/20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
                🍽️
              </div>
              <div className="text-5xl font-bold mb-3">
                <AnimatedCounter value={stats.totalMeals} suffix="+" />
              </div>
              <p className="text-lg text-white/90 font-medium">Total Meals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-400 border border-white/20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
                🏪
              </div>
              <div className="text-5xl font-bold mb-3">
                <AnimatedCounter value={stats.totalProviders} suffix="+" />
              </div>
              <p className="text-lg text-white/90 font-medium">
                Restaurant Partners
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-400 border border-white/20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
                👥
              </div>
              <div className="text-5xl font-bold mb-3">
                <AnimatedCounter value={stats.totalUsers} suffix="+" />
              </div>
              <p className="text-lg text-white/90 font-medium">
                Happy Customers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-400 border border-white/20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
                ⭐
              </div>
              <div className="text-5xl font-bold mb-3">
                <AnimatedCounter value={stats.totalReviews} suffix="+" />
              </div>
              <p className="text-lg text-white/90 font-medium">
                Customer Reviews
              </p>
            </motion.div>
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && !error && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-xl text-white/90 mb-6 font-medium">
              Join thousands of satisfied customers today!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
