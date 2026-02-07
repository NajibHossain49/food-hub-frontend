'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const menuItems = [
  {
    emoji: '🍕',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, basil, and tomato sauce.',
    price: '$12.99'
  },
  {
    emoji: '🍔',
    name: 'Gourmet Burger',
    description: 'Juicy beef patty with premium toppings and our signature sauce.',
    price: '$14.99'
  },
  {
    emoji: '🍜',
    name: 'Ramen Bowl',
    description: 'Authentic Japanese ramen with rich broth and fresh vegetables.',
    price: '$13.99'
  },
  {
    emoji: '🥗',
    name: 'Caesar Salad',
    description: 'Crispy romaine, parmesan, croutons with creamy Caesar dressing.',
    price: '$9.99'
  }
]

export default function Menu() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="menu" className="py-24 px-6 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-orange-primary)] font-bold uppercase tracking-wider text-sm mb-4"
          >
            Our Menu
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-family-serif)] text-5xl md:text-6xl mb-6"
          >
            Popular Dishes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Handpicked favorites that keep our customers coming back for more.
          </motion.p>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[var(--color-cream)] rounded-3xl overflow-hidden hover:-translate-y-3 hover:shadow-2xl hover:shadow-[var(--color-orange-primary)]/20 transition-all duration-400 cursor-pointer"
            >
              {/* Image Container */}
              <div className="h-64 bg-gradient-to-br from-orange-light to-orange-primary flex items-center justify-center text-8xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent animate-pulse" />
                <span className="relative z-10">{item.emoji}</span>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[var(--color-orange-primary)]">{item.price}</span>
                  <button className="bg-[var(--color-orange-primary)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--color-orange-dark)] hover:scale-105 transition-all duration-300">
                    Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
