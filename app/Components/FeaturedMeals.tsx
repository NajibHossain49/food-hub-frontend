'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import type { FeaturedMeal } from '@/types/api'

export default function FeaturedMeals() {
  const [meals, setMeals] = useState<FeaturedMeal[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    async function fetchFeaturedMeals() {
      try {
        const response = await fetch('/api/home/featured-meals')
        const data = await response.json()
        setMeals(data)
      } catch (error) {
        console.error('Failed to fetch featured meals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMeals()
  }, [])

  return (
    <section id="featured-meals" className="py-24 px-6 bg-gradient-to-br from-[var(--color-cream)] to-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-orange-primary)] font-bold uppercase tracking-wider text-sm mb-4"
          >
            Featured Today
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
          >
            Featured Meals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Discover our chef&apos;s special selections, handpicked just for you today.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Meals Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-[var(--color-orange-primary)] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {meal.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-[var(--color-dark)]">
                    {meal.name}
                  </h3>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {meal.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="inline-flex items-center gap-1">
                      🏪 {meal.providerName}
                    </span>
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-3xl font-bold text-[var(--color-orange-primary)]">
                      ${meal.price}
                    </span>
                    <button className="bg-[var(--color-orange-primary)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--color-orange-dark)] hover:scale-105 transition-all duration-300 shadow-lg shadow-[var(--color-orange-primary)]/30">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
