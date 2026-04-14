'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useCart } from '@/app/context/CartContext'

const FloatingCart = () => {
  const [mounted, setMounted] = useState(false)
  const { state } = useCart()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button className="relative bg-[#FFC107] text-black p-4 rounded-full shadow-[0_10px_30px_rgba(255,193,7,0.4)] hover:shadow-[0_15px_40px_rgba(255,193,7,0.6)] transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
          <Icon icon="solar:cart-large-minimalistic-bold-duotone" width="32" height="32" />
          {state.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
              {state.totalItems}
            </span>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingCart