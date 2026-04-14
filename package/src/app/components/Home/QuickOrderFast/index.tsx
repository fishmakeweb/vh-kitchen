'use client'

import React, { useState } from 'react'
import { useCart } from '@/app/context/CartContext'
import toast from 'react-hot-toast'
import axiosClient from '@/utils/axiosClient'

const QuickOrderFast = () => {
  const { dispatch } = useCart()
  const [loading, setLoading] = useState(false)
  
  const [qty, setQty] = useState(1)
  const [addons, setAddons] = useState({ cheese: false, sauce: false, bacon: false })

  const handleToggle = (key: keyof typeof addons) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const basePrice = 190000 // 190k VND

  const total = (basePrice + (addons.cheese ? 25000 : 0) + (addons.sauce ? 10000 : 0) + (addons.bacon ? 35000 : 0)) * qty

  const handleCheckout = async () => {
    try {
      setLoading(true)
      
      const item = {
        id: 'pizza-1m',
        name: 'Pizza Kéo Dài 1m',
        price: total / qty, // unit price with addons
        quantity: qty
      }

      // 1. Thêm vào Context
      dispatch({ type: 'ADD_ITEM', payload: item })

      // 2. Gọi API đặt hàng
      await axiosClient.post('/order', {
        items: [item],
        totalAmount: total,
        paymentMethod: 'COD',
        shippingAddress: 'Current Address' 
      })

      toast.success('Đặt hàng thành công! Đang chuẩn bị món...')
      
      // Reset form
      setQty(1)
      setAddons({ cheese: false, sauce: false, bacon: false })
      
    } catch (error) {
      console.error('Order failed:', error)
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-gray-100 py-24" id="quick-order">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl p-8 lg:p-16 border border-gray-100">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2 block">Quick Checkout</span>
            <h2 className="text-4xl font-extrabold text-black">Chốt Đơn Siêu Tốc</h2>
            <p className="text-gray-500 mt-2 text-lg">Chỉ với 2 cú nhấp, thưởng thức ngay sự bùng nổ.</p>
          </div>

          <div className="bg-gray-50 rounded-[2rem] p-6 lg:p-10 mb-8 border border-gray-100">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10 pb-10 border-b border-gray-200">
                <div className="flex items-center gap-6 w-full lg:w-auto text-left">
                  <div className="w-24 h-24 rounded-full bg-cover bg-center shrink-0 border-4 border-white shadow-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop')" }}></div>
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-1">Pizza Kéo Dài 1m</h3>
                    <p className="text-xl text-primary font-black">190.000đ</p>
                  </div>
                </div>

                {/* Tapping Target Buttons */}
                <div className="flex items-center gap-4 bg-white rounded-full p-2 shadow-sm border border-gray-200 w-full lg:w-auto justify-between lg:justify-start">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 text-3xl font-medium text-black flex items-center justify-center transition-colors shadow-inner"
                  >
                    -
                  </button>
                  <span className="text-3xl font-black text-black w-12 text-center">{qty}</span>
                  <button 
                     onClick={() => setQty(qty + 1)}
                     className="w-14 h-14 rounded-full bg-primary text-white hover:bg-red-600 text-3xl font-medium flex items-center justify-center transition-colors shadow-[0_5px_15px_rgba(239,68,68,0.4)]"
                  >
                    +
                  </button>
                </div>
             </div>

             {/* Add Topping Checkbox/Switches */}
             <div className="space-y-4">
               <h4 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-4">Thêm Topping Cực Đã</h4>
               
               {[
                 { id: 'cheese', name: 'Thiên Cung Phô Mai (Double Cheese)', price: '25.000đ' },
                 { id: 'sauce', name: 'Sốt Cay Tê Tái', price: '10.000đ' },
                 { id: 'bacon', name: 'Thịt Xông Khói Chiên Giòn', price: '35.000đ' }
               ].map(topping => (
                 <label key={topping.id} className="flex hidden lg:flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-yellow-200 cursor-pointer transition-colors bg-white">
                    <div className="flex items-center gap-4">
                      {/* Custom Checkbox */}
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center border-2 transition-all ${addons[topping.id as keyof typeof addons] ? 'bg-[#FFC107] border-[#FFC107]' : 'bg-gray-50 border-gray-300'}`}>
                        {addons[topping.id as keyof typeof addons] && <span className="text-black font-bold text-xl">✓</span>}
                      </div>
                      <span className="text-lg font-bold text-gray-800 select-none">{topping.name}</span>
                    </div>
                    <span className="text-primary font-bold">{topping.price}</span>
                    {/* Hidden Native Input */}
                    <input type="checkbox" className="hidden" checked={addons[topping.id as keyof typeof addons]} onChange={() => handleToggle(topping.id as keyof typeof addons)} />
                 </label>
               ))}

               {/* Mobile view of toppings for easier tapping */}
               <div className="grid grid-cols-1 gap-4 lg:hidden">
                 {[
                   { id: 'cheese', name: 'Double Cheese', price: '25k' },
                   { id: 'sauce', name: 'Sốt Cay', price: '10k' },
                   { id: 'bacon', name: 'Bacon Giòn', price: '35k' }
                 ].map(topping => (
                    <label key={topping.id} className={`flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${addons[topping.id as keyof typeof addons] ? 'bg-yellow-50 border-[#FFC107] shadow-md' : 'bg-white border-gray-100'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-gray-900 select-none">{topping.name}</span>
                        <input type="checkbox" className="w-8 h-8 rounded border-gray-300 text-primary accent-primary" 
                               checked={addons[topping.id as keyof typeof addons]} 
                               onChange={() => handleToggle(topping.id as keyof typeof addons)} />
                      </div>
                      <span className="text-primary font-bold text-lg">+{topping.price}</span>
                    </label>
                 ))}
               </div>
             </div>
          </div>

          {/* Checkout Action */}
           <div className="flex flex-col items-center">
             <div className="text-center mb-8">
               <p className="text-gray-500 font-medium mb-1">Tổng thanh toán</p>
               <h3 className="text-5xl font-black text-black">{total.toLocaleString('vi-VN')}đ</h3>
             </div>
             
             {/* Neon Glow Button */}
             <button 
               onClick={handleCheckout} 
               disabled={loading}
               className="w-full lg:w-auto relative group disabled:opacity-50"
             >
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-[#FFC107] rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative bg-primary text-white text-3xl font-black py-6 px-20 border-4 border-black rounded-full uppercase tracking-widest transform transition hover:scale-105 active:scale-95 text-shadow-sm flex items-center justify-center gap-4 w-full">
                  {loading ? 'Đang xử lý...' : 'Thanh Toán Ngay'}
                  {!loading && <span className="text-4xl">🚀</span>}
                </div>
             </button>
             <p className="text-gray-400 font-bold mt-6 text-sm flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block animate-pulse"></span>
                Dự kiến giao hàng trong 30 phút
             </p>
           </div>
        </div>
      </div>
    </section>
  )
}

export default QuickOrderFast