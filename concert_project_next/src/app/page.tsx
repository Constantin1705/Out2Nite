'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="text-6xl md:text-8xl mb-4">🌙</div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            Out2Nite
          </h1>
        </motion.div>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-8">
          Discover Groningen&#39;s nightlife: concerts, parties, meetups, and hidden gems tonight!
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/map"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-secondary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            🗺️ Discover Map
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary hover:border-secondary text-primary hover:text-secondary font-bold rounded-lg transition-all duration-300"
          >
            ✨ Join Now
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🎵', label: 'Concerts' },
            { emoji: '🍻', label: 'Bars' },
            { emoji: '🎉', label: 'Events' },
            { emoji: '🤝', label: 'Meetups' },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-dark-700/50 border border-dark-600 hover:border-primary transition-colors"
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <p className="text-gray-300">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
