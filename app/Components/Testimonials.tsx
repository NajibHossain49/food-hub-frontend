'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    stars: 5,
    text: "Best food delivery service I've ever used! The food always arrives hot and fresh, and the delivery is incredibly fast. Highly recommend!",
    name: 'Sarah Johnson',
    role: 'Verified Customer',
    avatar: 'S'
  },
  {
    stars: 5,
    text: "The variety of restaurants is amazing, and the app is so easy to use. I order from FoodHub at least 3 times a week. Love it!",
    name: 'Michael Chen',
    role: 'Verified Customer',
    avatar: 'M'
  },
  {
    stars: 5,
    text: "Customer service is outstanding! Had an issue once and it was resolved immediately. Plus, the food quality is consistently excellent.",
    name: 'Emily Rodriguez',
    role: 'Verified Customer',
    avatar: 'E'
  }
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="testimonials" className="py-24 px-6 bg-gradient-to-br from-dark to-[#2D2D2D] text-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-orange-light)] font-bold uppercase tracking-wider text-sm mb-4"
          >
            What People Say
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
          >
            Customer Reviews
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-300 leading-relaxed"
          >
            Don't just take our word for it. Here's what our customers have to say.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-[var(--color-orange-primary)]/20 hover:-translate-y-2 hover:border-[var(--color-orange-primary)] hover:shadow-2xl hover:shadow-[var(--color-orange-primary)]/20 transition-all duration-400 cursor-pointer"
            >
              {/* Stars */}
              <div className="text-[var(--color-orange-primary)] text-2xl mb-6">
                {'⭐'.repeat(testimonial.stars)}
              </div>

              {/* Review Text */}
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                "{testimonial.text}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-orange-primary)] rounded-full flex items-center justify-center font-bold text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <span className="text-sm text-white/60">{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
