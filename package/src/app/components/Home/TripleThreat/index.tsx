'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const combos = [
  {
    id: 1,
    name: 'Combo Solo',
    desc: '1 Burger + 1 Khoai tây + 1 Coca',
    price: '99.000đ',
    badge: '',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop' // Fixed image URL
  },
  {
    id: 2,
    name: 'Combo Double',
    desc: '1 Pizza kéo phô mai + 1 Gà rán + 2 Coca',
    price: '249.000đ',
    badge: 'Best Seller',
    popular: true,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Combo Party',
    desc: '2 Pizza + 1 Gà rán + Ngập tràn khoai tây & Coca',
    price: '399.000đ',
    badge: 'Tiết kiệm 20%',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop'
  }
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
}

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const
    }
  }
}

const TripleThreat = () => {
  return (
    <section className="bg-zinc-900 py-32 overflow-hidden text-white" id="combos">
      <div className="container px-4">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-[#FFC107] font-extrabold text-5xl lg:text-6xl mb-4 tracking-tight drop-shadow-[0_0_10px_rgba(255,193,7,0.8)]">The Triple Threat</h2>
          <p className="text-gray-300 text-xl font-medium max-w-2xl mx-auto">Bộ ba combo bán chạy nhất, thổi bùng vị giác cho mọi bữa tiệc. Mua càng đông, giảm càng sâu!</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {combos.map((combo) => (
            <motion.div 
              key={combo.id}
              variants={itemVariants}
              className={`relative bg-zinc-800 rounded-3xl p-8 border-2 transition-all hover:bg-zinc-700/50 ${combo.popular ? 'border-[#FFC107] scale-105 z-10 shadow-[0_20px_50px_rgba(255,193,7,0.15)]' : 'border-zinc-700 hover:border-zinc-500'}`}
            >
              {combo.badge && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className={`px-6 py-2 rounded-full font-bold text-sm tracking-wider uppercase ${combo.popular ? 'bg-[#FFC107] text-black shadow-[0_0_15px_rgba(255,193,7,0.5)]' : 'bg-red-500 text-white'}`}>
                    {combo.badge}
                  </span>
                </div>
              )}

              <motion.div 
                className="flex justify-center -mt-16 mb-8 h-48 w-48 mx-auto relative rounded-full border-4 border-zinc-900 bg-black overflow-hidden pointer-events-none"
                variants={floatingVariants}
                animate="animate"
                style={{ backgroundImage: `url(${combo.image})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)' }}
              >
                 {/* Visual float placeholder via background image - in reality, transparent PNGs are better for floating effect */}
                 <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
              </motion.div>

              <div className="text-center">
                <h3 className={`text-2xl font-extrabold mb-3 ${combo.popular ? 'text-[#FFC107]' : 'text-white'}`}>{combo.name}</h3>
                <p className="text-gray-400 font-medium mb-8 min-h-[50px]">{combo.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-black">{combo.price}</span>
                </div>
                <button className={`w-full py-4 rounded-full font-bold text-lg transition-transform transform hover:scale-105 ${combo.popular ? 'bg-[#FFC107] text-black hover:bg-yellow-400' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`}>
                  Thêm vào giỏ
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TripleThreat