"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-20 px-6 bg-gradient-to-br from-[var(--color-cream)] to-[#FFE5D9] relative overflow-hidden"
    >
      {/* Animated Background Circle */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] -translate-y-1/2 translate-x-1/4">
        <div className="w-full h-full rounded-full bg-gradient-radial from-orange-primary/15 to-transparent animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-[var(--color-orange-primary)] text-white px-6 py-2 rounded-full text-sm font-semibold mb-6"
            >
              🎉 Free Delivery on First Order
            </motion.span>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-[family-name:var(--font-family-serif)] text-5xl md:text-7xl leading-tight mb-6"
            >
              Delicious Food <br />
              <span className="text-[var(--color-orange-primary)]">
                Delivered Fast
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed"
            >
              Experience restaurant-quality meals delivered straight to your
              doorstep. Fresh ingredients, expert chefs, and lightning-fast
              delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("featured-meals")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-[var(--color-orange-primary)] text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg shadow-[var(--color-orange-primary)]/30 hover:bg-[var(--color-orange-dark)] hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--color-orange-primary)]/40 transition-all duration-300"
              >
                Explore Feature Meals
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-transparent text-[var(--color-dark)] px-10 py-4 rounded-full font-semibold text-lg border-2 border-dark hover:bg-[var(--color-dark)] hover:text-white transition-all duration-300"
              >
                How It Works
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Circle */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[550px] h-[550px]">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-primary to-orange-dark rounded-full shadow-2xl shadow-[var(--color-orange-primary)]/30 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="text-8xl"
                >
                  🍕
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
