'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '1',
    title: 'Choose Your Meal',
    description: 'Browse through hundreds of restaurants and dishes. Find exactly what you\'re craving.'
  },
  {
    number: '2',
    title: 'Place Your Order',
    description: 'Add items to cart and checkout securely. Track your order in real-time.'
  },
  {
    number: '3',
    title: 'Enjoy Your Food',
    description: 'Receive your hot, fresh meal at your doorstep. Sit back and enjoy!'
  }
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how" className="py-24 px-6 bg-gradient-to-br from-[var(--color-cream)] via-[#FFE5D9] to-[var(--color-cream)] relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-orange-primary)] font-bold uppercase tracking-wider text-sm mb-4"
          >
            Simple Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Getting your favorite food has never been easier. Just three simple steps.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white p-12 rounded-3xl text-center shadow-lg hover:shadow-2xl hover:shadow-[var(--color-orange-primary)]/20 hover:scale-105 transition-all duration-400 cursor-pointer"
            >
              {/* Number */}
              <div className="w-16 h-16 bg-[var(--color-orange-primary)] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-lg shadow-[var(--color-orange-primary)]/30">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
