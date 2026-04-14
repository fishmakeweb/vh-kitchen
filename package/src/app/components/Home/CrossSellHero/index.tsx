'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const CrossSellHero = () => {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef as any,
    offset: ["start end", "end start"]
  })

  // Mức độ zoom tùy chỉnh
  const scaleChicken = useTransform(scrollYProgress, [0, 1], [1, 1.4])
  const scaleBurger = useTransform(scrollYProgress, [0, 1], [1, 1.4])
  const yChicken = useTransform(scrollYProgress, [0, 1], [50, -50])
  const yBurger = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="bg-black py-40 overflow-hidden relative">
      <div className="container px-4">
        <div className="text-center mb-24 relative z-20">
          <h2 className="text-white text-5xl lg:text-[5rem] font-black uppercase tracking-tight leading-tight">Không chỉ Pizza<br /><span className="text-[#ef4444] drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">Là Siêu Phẩm</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
          {/* Chicken Cross-sell */}
          <div className="relative h-[600px] rounded-[3rem] overflow-hidden group">
            <motion.div 
              style={{ scale: scaleChicken, y: yChicken, backgroundImage: "url('https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop')" }}
              className="absolute inset-0 bg-cover bg-center w-full h-full"
            />
            {/* Adding vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-16 w-full text-center">
              <h3 className="text-5xl font-black text-white mb-4 drop-shadow-2xl">Gà Rán</h3>
              <p className="text-3xl text-yellow-400 font-bold mb-8 italic drop-shadow-md decoration-slice">"Giòn tan đến miếng cuối cùng."</p>
              <button className="mx-auto border-2 border-white text-white font-bold py-4 px-12 rounded-full backdrop-blur-md bg-white/10 hover:bg-white hover:text-black transition-all duration-300">
                Khám phá
              </button>
            </div>
          </div>

          {/* Burger Cross-sell */}
          <div className="relative h-[600px] rounded-[3rem] overflow-hidden group">
            <motion.div 
              style={{ scale: scaleBurger, y: yBurger, backgroundImage: "url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop')" }}
              className="absolute inset-0 bg-cover bg-center w-full h-full"
            />
             {/* Adding vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-16 text-center">
              <h3 className="text-5xl font-black text-white mb-4 drop-shadow-2xl">Hamburger</h3>
              <p className="text-3xl text-[#FFC107] font-bold mb-8 italic drop-shadow-md">"Thịt nướng lửa hồng, đậm vị nguyên bản."</p>
              <button className="mx-auto border-2 border-[#FFC107] text-[#FFC107] font-bold py-4 px-12 rounded-full backdrop-blur-md bg-[#FFC107]/10 hover:bg-[#FFC107] hover:text-black transition-all duration-300">
                Thử ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative large text behind */}
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-zinc-900/50 whitespace-nowrap z-0 select-none pointer-events-none">
        BEYOND
      </h1>
    </section>
  )
}

export default CrossSellHero