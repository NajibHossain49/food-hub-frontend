"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-6 bg-[var(--color-cream)]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-orange-primary to-orange-dark px-12 py-20 rounded-[40px] shadow-2xl shadow-[var(--color-orange-primary)]/30 text-center text-white relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          {/* Content */}
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
            >
              Ready to Order?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            >
              Join thousands of happy customers and get your favorite food
              delivered today!
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white text-[var(--color-orange-primary)] px-12 py-5 rounded-full font-bold text-xl hover:bg-[var(--color-cream)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <Link href="/Sign-up">Get Started Now</Link>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
