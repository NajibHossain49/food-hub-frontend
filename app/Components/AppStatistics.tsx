"use client";

import type { AppStats } from "@/types/api";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AppStatistics() {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/home/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statsData = [
    {
      icon: "🍽️",
      label: "Total Meals",
      value: stats?.totalMeals || 0,
      suffix: "+",
      color: "from-orange-400 to-red-500",
    },
    {
      icon: "🏪",
      label: "Restaurant Partners",
      value: stats?.totalProviders || 0,
      suffix: "+",
      color: "from-blue-400 to-indigo-500",
    },
    {
      icon: "👥",
      label: "Happy Customers",
      value: stats?.totalUsers || 0,
      suffix: "+",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: "⭐",
      label: "Customer Reviews",
      value: stats?.totalReviews || 0,
      suffix: "+",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  // Animated counter component
  const AnimatedCounter = ({
    value,
    suffix,
  }: {
    value: number;
    suffix: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps

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

        {/* Statistics Grid */}
        {!loading && stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-400 border border-white/20"
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl`}
                >
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-5xl font-bold mb-3">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="text-lg text-white/90 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && stats && (
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
