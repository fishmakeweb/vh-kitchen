'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import axiosClient from '@/utils/axiosClient'
import { useCart } from '@/app/context/CartContext'
import toast from 'react-hot-toast'

interface MenuItem {
  id: string
  name: string
  price: number
  description?: string
  imageUrl?: string
  category?: string
  calories?: number
}

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: 'fluent-emoji-flat:fork-and-knife' },
  { id: 'burger', name: 'Burger', icon: 'fluent-emoji-flat:hamburger' },
  { id: 'chicken', name: 'Gà rán', icon: 'fluent-emoji-flat:poultry-leg' },
  { id: 'pizza', name: 'Pizza', icon: 'fluent-emoji-flat:pizza' },
  { id: 'drink', name: 'Đồ uống', icon: 'fluent-emoji-flat:cup-with-straw' },
  { id: 'healthy', name: 'Healthy', icon: 'fluent-emoji-flat:green-salad' },
]

const MobileMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const { dispatch } = useCart()

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await axiosClient.get('/catalog')
        const items = response.data?.data || response.data || []
        // map existing data or provide mocks if fields are missing
        const mappedItems = items.map((item: any, i: number) => ({
          ...item,
          price: item.price || Math.floor(Math.random() * 5 + 5) * 10000, // random 50k - 100k
          calories: item.calories || Math.floor(Math.random() * 400 + 200), // mock AI parsed calories
        }))
        setMenuItems(mappedItems)
      } catch (error) {
        console.error('Failed to fetch catalog:', error)
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchCatalog()
  }, [])

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Add to cart state
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.imageUrl || '/images/hero/pizza.webp',
      },
    })
    
    // Simple toast for micro-interaction
    toast.success(`Đã thêm ${item.name} vào giỏ hàng`, {
      icon: '🛒',
      position: 'top-center'
    })
  }

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-black tracking-tight">Thực đơn hôm nay</h2>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">Xem tất cả</span>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide snap-x">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`snap-start flex min-w-max items-center justify-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 font-medium text-sm border-2 ${
              activeCategory === cat.id 
                ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Icon icon={cat.icon} className="text-xl" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid - 2 layout cols for Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          // Skeleton Loading
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-[240px] animate-pulse">
              <div className="w-full h-[120px] bg-gray-200 rounded-xl mb-3"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded-full mb-auto"></div>
              <div className="flex justify-between items-end mt-2">
                <div className="w-1/3 h-5 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence>
            {menuItems.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={item.id}
                className="group relative flex flex-col bg-white rounded-2xl p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-50 hover:shadow-md transition-shadow h-full"
              >
                {/* Calories AI Tag */}
                {item.calories && (
                  <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Icon icon="solar:fire-bold-duotone" className="text-orange-500 text-xs" />
                    <span className="text-[10px] font-bold text-gray-700">{item.calories} Kcal</span>
                  </div>
                )}
                
                {/* Image */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50">
                  <Image
                    src={item.imageUrl || '/images/hero/pizza.webp'}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-auto">{item.description || 'Thơm ngon khó cưỡng'}</p>
                  
                  <div className="flex items-end justify-between mt-3">
                    <span className="text-primary font-extrabold text-sm border-b-2 border-primary/20 pb-0.5">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart FAB (Floating Action Button inside card) */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleAddToCart(item, e)}
                  className="absolute bottom-2 right-2 w-9 h-9 bg-primary text-white flex items-center justify-center rounded-full shadow-md hover:bg-primary/90 transition-colors z-10"
                >
                  <Icon icon="ic:round-plus" className="text-2xl" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && menuItems.length === 0 && (
         <div className="w-full py-10 flex flex-col items-center justify-center text-center opacity-70">
            <Icon icon="fluent-emoji-flat:loudly-crying-face" className="text-6xl mb-3" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">Cái bụng đói buồn!</h3>
            <p className="text-sm text-gray-500">Chưa có món nào trong danh mục này.</p>
         </div>
      )}
    </section>
  )
}

export default MobileMenu