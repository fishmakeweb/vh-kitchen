'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'
import { motion } from 'framer-motion'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'solar:pie-chart-2-bold-duotone' },
    { name: 'AI Menu Processor', path: '/menu-processor', icon: 'solar:magic-stick-3-bold-duotone', highlight: true },
    { name: 'Khuyến mãi Flash Sale', path: '/flash-sale', icon: 'solar:bolt-bold-duotone' },
    { name: 'Quản lý Đơn hàng', path: '/orders', icon: 'solar:cart-large-minimalistic-bold-duotone' },
    { name: 'Sản phẩm', path: '/catalog', icon: 'solar:box-bold-duotone' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-gray-900 border-r border-gray-800 text-white flex-shrink-0 relative transition-all hidden md:block"
      >
        <div className="p-5 flex items-center gap-3">
          <Icon icon="fluent-emoji-flat:crown" className="text-4xl shrink-0" />
          {isSidebarOpen && <span className="font-extrabold text-xl tracking-tight leading-tight whitespace-nowrap">vh kitchen Admin</span>}
        </div>

        <nav className="mt-6 px-3 space-y-2">
          {menuItems.map(item => {
            const isActive = pathname.startsWith(item.path)
            return (
              <Link key={item.path} href={item.path}>
                <div className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:bg-gray-800 text-gray-400 hover:text-white border border-transparent'}`}>
                  <Icon icon={item.icon} className={`text-2xl shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${item.highlight ? 'text-purple-400' : ''}`} />
                  {isSidebarOpen && (
                    <span className={`ml-3 font-semibold text-sm whitespace-nowrap ${item.highlight ? 'text-purple-300' : ''}`}>
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {isSidebarOpen && (
          <div className="absolute bottom-6 left-4 right-4 bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">AD</div>
               <div>
                  <p className="text-xs font-bold text-white">System Admin</p>
                  <p className="text-[10px] text-gray-400">admin@vhkitchen.com</p>
               </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-black">
              <Icon icon="solar:hamburger-menu-linear" className="text-2xl" />
            </button>
            <div className="relative hidden md:block">
              <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh đơn hàng..." 
                className="bg-gray-100 pl-10 pr-4 py-2 rounded-lg text-sm w-64 outline-none focus:w-80 transition-all focus:bg-white focus:ring-2 ring-primary/20 border border-transparent focus:border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors">
              <Icon icon="solar:bell-bing-bold-duotone" className="text-xl" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto bg-[#F4F7FE]">
          {children}
        </div>
      </main>
    </div>
  )
}