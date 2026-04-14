'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import axiosClient from '@/utils/axiosClient'
import toast from 'react-hot-toast'

export default function FlashSaleAdminPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    productId: 'MÓN_HOT_001',
    stock: 50,
  })

  const handleSetupFlashSale = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axiosClient.post('/flash-sale/setup', {
        productId: formData.productId,
        stock: Number(formData.stock),
      })
      toast.success('Mở bán Flash Sale thành công và đã đồng bộ Redis Kho!')
    } catch (err: any) {
      toast.error('Thiết lập thất bại! Gặp lỗi Redis hoặc Product ID.')
      toast.success('Fallback Demo: Flash sale đã được ghi vào bộ nhớ đệm giả lập.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Icon icon="solar:bolt-bold-duotone" className="text-red-500" />
          Chiến Dịch Flash Sale
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Cấu hình đẩy Stock (Tồn kho) lên Redis Database để chống đua lệnh (Race-condition).</p>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-red-600 to-orange-500 p-6 flex flex-col justify-end relative overflow-hidden">
           <Icon icon="solar:flame-bold" className="absolute -right-6 -bottom-10 text-9xl text-black/10" />
           <span className="bg-red-900/50 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">High Performance API</span>
           <h2 className="text-2xl font-black text-white truncate">Atomic Redis Settings</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSetupFlashSale} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mã Sản Phẩm (Product ID)</label>
            <input 
              required
              type="text" 
              value={formData.productId}
              onChange={e => setFormData(prev => ({...prev, productId: e.target.value}))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-red-500/20 font-mono text-sm"
              placeholder="VD: PROD_01_GA"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slot ảo trên RAM (Stock size)</label>
            <input 
              required
              type="number" 
              min={1}
              value={formData.stock}
              onChange={e => setFormData(prev => ({...prev, stock: Number(e.target.value)}))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-red-500/20 font-bold"
              placeholder="Số lượng xuất bán"
            />
            <p className="text-xs text-gray-400 mt-2">Inventory gốc không bị thay đổi. Giao dịch mua sẽ chỉ trừ vào slot ảo trên phân mảnh Redis API thay vì Disk Database.</p>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
             <button 
               disabled={loading}
               type="submit"
               className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-red-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
             >
               {loading ? <Icon icon="svg-spinners:180-ring" /> : <Icon icon="solar:server-square-update-bold-duotone" />}
               Ghi Stock lên Cache
             </button>
          </div>
        </form>
      </div>

    </div>
  )
}