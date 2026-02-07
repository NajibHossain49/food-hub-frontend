'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: "Get your favorite meals delivered in 30 minutes or less. We value your time as much as you do."
  },
  {
    icon: '🌟',
    title: 'Premium Quality',
    description: "Only the freshest ingredients from trusted suppliers. Quality you can taste in every bite."
  },
  {
    icon: '💰',
    title: 'Best Prices',
    description: "Enjoy restaurant-quality food at affordable prices. Great taste shouldn't break the bank."
  },
  {
    icon: '🔒',
    title: 'Safe & Secure',
    description: "Contactless delivery and strict hygiene protocols. Your safety is our top priority."
  }
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-24 px-6 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-orange-primary)] font-bold uppercase tracking-wider text-sm mb-4"
          >
            Why Choose Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
          >
            What Makes Us Special
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            We're committed to delivering not just food, but an exceptional experience with every order.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[var(--color-cream)] p-10 rounded-3xl relative overflow-hidden group hover:-translate-y-3 transition-all duration-400 cursor-pointer"
            >
              {/* Hover Effect Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-primary to-orange-light scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-primary to-orange-light rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-lg shadow-[var(--color-orange-primary)]/20">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
