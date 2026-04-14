'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import axiosClient from '@/utils/axiosClient'
import toast from 'react-hot-toast'

interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  pendingOrders: number
  revenueTrend: number
  ordersTrend: number
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosClient.get('/analytics/dashboard')
        // Assume API returns data in res.data.data or res.data
        const data = res.data?.data || res.data
        
        // Map the real data to our metrics format, with fallbacks if properties are missing
        setMetrics({
          totalRevenue: data.totalSales || 0,
          totalOrders: data.totalOrders || 0,
          totalCustomers: data.activeUsers || 0,
          pendingOrders: data.pendingOrders || 0,
          revenueTrend: data.revenueTrend || 0,
          ordersTrend: data.ordersTrend || 0,
        })
      } catch (error) {
        console.error('Failed to fetch dashboard metrics', error)
        toast.error('Không thể tải dữ liệu thống kê')
        
        // Provide fallback visual data if API fails or doesn't have exact fields yet
        setMetrics({
          totalRevenue: 24500,
          totalOrders: 143,
          totalCustomers: 1200,
          pendingOrders: 24,
          revenueTrend: 14.5,
          ordersTrend: 5.2,
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const formatTrend = (trend: number) => {
    const isPositive = trend >= 0
    return {
      text: `${isPositive ? '+' : ''}${trend}%`,
      isPositive
    }
  }

  const getStatsArray = () => {
    if (!metrics) return []
    
    const revTrend = formatTrend(metrics.revenueTrend)
    const ordTrend = formatTrend(metrics.ordersTrend)

    return [
      { title: 'Doanh thu', value: formatCurrency(metrics.totalRevenue), trend: revTrend.text, isPositive: revTrend.isPositive, icon: 'solar:wallet-bold-duotone', color: 'bg-green-100 text-green-600' },
      { title: 'Đơn hàng mới', value: metrics.totalOrders.toLocaleString(), trend: ordTrend.text, isPositive: ordTrend.isPositive, icon: 'solar:cart-large-minimalistic-bold-duotone', color: 'bg-blue-100 text-blue-600' },
      { title: 'Khách hàng', value: metrics.totalCustomers.toLocaleString(), trend: '+0%', isPositive: true, icon: 'solar:users-group-rounded-bold-duotone', color: 'bg-orange-100 text-orange-600' },
      { title: 'Đang giao / Chờ duyệt', value: metrics.pendingOrders.toString(), trend: 'Ổn định', isPositive: true, icon: 'solar:routing-2-bold-duotone', color: 'bg-purple-100 text-purple-600' },
    ]
  }

  const stats = getStatsArray()

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Chào mừng quay lại, xem tình hình kinh doanh hôm nay.</p>
        </div>
        
        <button className="bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-orange-500/30">
          <Icon icon="solar:document-add-bold" className="text-xl" />
          Tạo Báo cáo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-3xl font-black text-gray-800 mt-2 tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon icon={stat.icon} className="text-2xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
               <span className={`font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-md`}>
                 {stat.trend}
               </span>
               <span className="text-gray-400">so với tuần trước</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generative AI Insights Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent relative overflow-hidden group"
          style={{ backgroundClip: 'padding-box' }}
        >
          {/* Animated Gradient Border Layer */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-20 pointer-events-none group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="absolute inset-0 z-0 rounded-2xl border-2 border-transparent" style={{ background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #a855f7, #ec4899, #f97316) border-box' }}></div>
          
          <div className="relative z-10 flexitems-center gap-3 mb-6">
            <Icon icon="fluent-emoji:sparkles" className="text-3xl" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Mona AI Insights</h2>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-purple-50/80 p-4 rounded-xl border border-purple-100/50 backdrop-blur-sm">
               <div className="flex gap-3">
                 <Icon icon="solar:fire-bold-duotone" className="text-orange-500 text-2xl shrink-0 mt-0.5" />
                 <div>
                   <h4 className="font-bold text-gray-800">Cảnh báo tồn kho: Thịt bò nhập khẩu</h4>
                   <p className="text-gray-600 text-sm mt-1 leading-relaxed">Dự kiến hết trong 2 ngày dựa theo tốc độ bán hiện tại (tăng 45% do Flash Sale). Đề xuất nhập thêm 50kg.</p>
                   <button className="mt-3 bg-white text-purple-600 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all">Tự động báo NCC</button>
                 </div>
               </div>
            </div>

            <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100/50 backdrop-blur-sm">
               <div className="flex gap-3">
                 <Icon icon="solar:user-speak-bold-duotone" className="text-blue-500 text-2xl shrink-0 mt-0.5" />
                 <div>
                   <h4 className="font-bold text-gray-800">Phân tích hành vi từ Chatbot</h4>
                   <p className="text-gray-600 text-sm mt-1 leading-relaxed">70% khách hỏi về "combo giá rẻ cơm trưa". Hệ thống đề xuất tạo Menu Combo 45k vào Tab Khuyến Mãi ngay lập tức.</p>
                   <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2">
                     <Icon icon="solar:magic-stick-3-bold" />
                     Dùng AI tạo Menu này
                   </button>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Recent Orders */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Đơn hàng vừa xong</h2>
            <Link href="/orders" className="text-sm font-bold text-primary hover:underline">Xem tất cả</Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold font-mono text-xs">
                    #F8{order}A
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">Combo Trưa Vui Vẻ x2</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Vừa xong • Bàn 12</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">145k</p>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">Đã thanh toán</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  )
}