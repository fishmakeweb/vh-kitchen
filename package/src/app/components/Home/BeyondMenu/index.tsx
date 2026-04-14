'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import axiosClient from '@/utils/axiosClient'

const menuCategories = [
  {
    id: 'pizza',
    title: 'Pizza Đỉnh Cao',
    icon: 'ep:food', // Using as placeholder
    image: '/images/hero/pizza.webp', // Assuming we have it, else use unplash placeholder
    desc: 'Lớp phô mai béo ngậy, dai dẻo không giới hạn.',
    colorBg: 'bg-yellow-50',
    colorText: 'text-[#FFC107]',
    unplash: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'chicken',
    title: 'Gà Rán Giòn Tan',
    icon: 'mdi:food-drumstick-outline',
    image: '/images/features/feature-1.webp',
    desc: 'Giòn tan rộp rộp đến tận miếng xương cuối cùng.',
    colorBg: 'bg-red-50',
    colorText: 'text-red-500',
    unplash: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'burger',
    title: 'Burger Bò Mọng Nước',
    icon: 'mdi:hamburger',
    image: '/images/features/feature-2.webp',
    desc: 'Thịt bò nướng lửa hồng, đẫm vị nước sốt độc quyền.',
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-700',
    unplash: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop'
  }
]

const getCategoryStyles = (index: number) => {
  const styles = [
    { colorBg: 'bg-yellow-50', colorText: 'text-[#FFC107]', icon: 'ep:food' },
    { colorBg: 'bg-red-50', colorText: 'text-red-500', icon: 'mdi:food-drumstick-outline' },
    { colorBg: 'bg-amber-50', colorText: 'text-amber-700', icon: 'mdi:hamburger' },
    { colorBg: 'bg-green-50', colorText: 'text-green-500', icon: 'mdi:leaf' },
    { colorBg: 'bg-blue-50', colorText: 'text-blue-500', icon: 'mdi:water' },
  ]
  return styles[index % styles.length]
}

const BeyondMenu = () => {
  const [categories, setCategories] = useState(menuCategories)
  const [activeTab, setActiveTab] = useState(menuCategories[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await axiosClient.get('/catalog')
        // Assume API returns array in response.data or response.data.data
        const items = response.data?.data || response.data
        
        if (Array.isArray(items) && items.length > 0) {
          const mappedCategories = items.slice(0, 5).map((item, index) => {
            const styles = getCategoryStyles(index)
            return {
              id: item.id || `item-${index}`,
              title: item.name,
              icon: styles.icon,
              image: item.imageUrl || '/images/hero/pizza.webp',
              desc: item.description || 'Hương vị tuyệt hảo không thể chối từ.',
              colorBg: styles.colorBg,
              colorText: styles.colorText,
              unplash: item.imageUrl || menuCategories[index % menuCategories.length].unplash
            }
          })
          setCategories(mappedCategories)
          setActiveTab(mappedCategories[0])
        }
      } catch (error) {
        console.error('Failed to fetch catalog, using fallback data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCatalog()
  }, [])

  return (
    <section className={`py-24 transition-colors duration-700 ${activeTab.colorBg}`} id="beyond-menu">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">Beyond Pizza</h2>
          <p className="text-gray-600 text-xl font-medium">Khám phá vũ trụ thức ăn nhanh cực phẩm</p>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div 
          className="lg:hidden flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-12 -mx-4 px-4 touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            div::-webkit-scrollbar { display: none; }
          `}} />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat)}
              className={`snap-center shrink-0 w-60 p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                activeTab.id === cat.id 
                  ? 'border-black bg-white shadow-xl scale-105' 
                  : 'border-transparent bg-white/50 hover:bg-white'
              }`}
            >
              <div className={`w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 ${activeTab.id === cat.id ? cat.colorText : 'text-gray-400'}`}>
                <Icon icon={cat.icon} width="32" height="32" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">{cat.title}</h3>
            </button>
          ))}
        </div>

        {/* Mobile Content Display */}
        <div className="lg:hidden relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl mb-8">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                {...({ className: "absolute inset-0 w-full h-full" } as any)}
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeTab.unplash})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <h4 className="text-3xl font-extrabold mb-2">{activeTab.title}</h4>
                  <p className="text-lg font-medium opacity-90">{activeTab.desc}</p>
                </div>
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Desktop Split Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
          {/* Left: Tabs */}
          <div className="col-span-5 flex flex-col gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveTab(cat)}
                className={`cursor-pointer p-8 rounded-3xl border-l-8 transition-all duration-300 transform group ${
                  activeTab.id === cat.id 
                    ? 'border-black bg-white shadow-2xl scale-[1.02]' 
                    : 'border-transparent hover:bg-white/50 hover:pl-10'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${activeTab.id === cat.id ? 'bg-gray-100 ' + cat.colorText : 'bg-transparent text-gray-400 group-hover:text-gray-600'}`}>
                    <Icon icon={cat.icon} width="32" height="32" />
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold mb-2 transition-colors ${activeTab.id === cat.id ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {cat.title}
                    </h3>
                    <p className={`text-lg transition-opacity duration-300 ${activeTab.id === cat.id ? 'opacity-100 text-gray-600' : 'opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto'}`}>
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Animate Image */}
          <div className="col-span-7 h-[600px] relative rounded-3xl overflow-hidden shadow-2xl bg-white flex items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ y: 100, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -100, opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  {...({ className: "absolute inset-0 w-full h-full" } as any)}
                >
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${activeTab.unplash})` }} // Using unsplash placeholder to ensure high quality visual
                  />
                  {/* Overlay vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white">
                    <h4 className="text-4xl font-extrabold shadow-black drop-shadow-md mb-2">{activeTab.title}</h4>
                    <p className="text-2xl font-semibold opacity-90">{activeTab.desc}</p>
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BeyondMenu