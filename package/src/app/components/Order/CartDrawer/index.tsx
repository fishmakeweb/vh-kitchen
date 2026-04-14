'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useCart } from '@/app/context/CartContext'
import Image from 'next/image'
import axiosClient from '@/utils/axiosClient'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

const CartDrawer = () => {
  const { state: cartState, dispatch } = useCart()
  const { isCartOpen, items, totalPrice } = cartState
  
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Cart, 2: Checkout, 3: Tracking
  const [discountCode, setDiscountCode] = useState('')
  const [hasDiscount, setHasDiscount] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [address, setAddress] = useState('123 Đường Cầu Mới, Quận 1, TP.HCM')

  // Mock tracking states
  const [orderStatus, setOrderStatus] = useState(0) // 0: chờ, 1: nấu, 2: giao, 3: done
  const [isOrdering, setIsOrdering] = useState(false)

  const closeCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
    if (step === 3) {
      // clear cart if ordered
      dispatch({ type: 'CLEAR_CART' })
      setStep(1)
      setOrderStatus(0)
    }
  }

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === 'wow') {
      setHasDiscount(true)
      setShowConfetti(true)
      toast.success('Áp dụng mã WOW giảm 20% thành công!')
      setTimeout(() => setShowConfetti(false), 5000)
    } else {
      toast.error('Mã giảm giá không hợp lệ')
    }
  }

  const handleCheckout = async () => {
    setIsOrdering(true)
    try {
      const payload = {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        address,
        notes: '',
        paymentMethod
      }
      
      const res = await axiosClient.post('/order', payload)
      if (res.status === 201 || res.status === 200) {
        toast.success('Đặt món thành công!')
        setStep(3) // move to tracking
        
        // mock tracking progression
        const interval = setInterval(() => {
          setOrderStatus(prev => {
            if (prev >= 3) {
              clearInterval(interval)
              return 3
            }
            return prev + 1
          })
        }, 4000)
      }
    } catch (err: any) {
       if (err.response?.status === 429) {
         toast.error("Bạn đặt hàng nhanh quá, vui lòng chờ 5 giây nhé!")
       } else {
         toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng')
       }
    } finally {
      setIsOrdering(false)
    }
  }

  const finalPrice = hasDiscount ? totalPrice * 0.8 : totalPrice

  const renderCartEmpty = () => (
    <div className="flex flex-col items-center justify-center h-full opacity-70">
      <Icon icon="fluent-emoji-flat:hamburger" className="text-6xl mb-3 grayscale" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">Giỏ hàng rỗng</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-[200px] text-center">Nào, hãy lấp đầy chiếc bụng đói này đi!</p>
      <button 
        onClick={closeCart}
        className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-primary/90 transition-transform active:scale-95"
      >
        Khám phá Menu
      </button>
    </div>
  )

  const renderStep1_Cart = () => (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide space-y-4">
        <AnimatePresence>
          {items.map(item => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50"
             >
               <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 relative">
                 <Image src={item.image || '/images/hero/pizza.webp'} alt={item.name} fill className="object-cover" />
               </div>
               <div className="flex-1 flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{item.name}</h4>
                   <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
                     <Icon icon="solar:trash-bin-trash-bold" className="text-red-400 hover:text-red-600 transition-colors" />
                   </button>
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                   <span className="font-extrabold text-primary text-sm">
                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                   </span>
                   {/* Quantity */}
                   <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                     <button 
                       className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black font-bold"
                       onClick={() => {
                          if (item.quantity > 1) {
                            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: -1 } })
                          } else {
                            dispatch({ type: 'REMOVE_ITEM', payload: item.id })
                          }
                       }}
                     >-</button>
                     <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                     <button 
                       className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black font-bold"
                       onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: 1 } })}
                     >+</button>
                   </div>
                 </div>
               </div>
             </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Checkout action */}
      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl mt-auto">
         <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-medium">Tổng thanh toán</span>
            <span className="text-2xl font-extrabold text-black">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </span>
         </div>
         <button 
           onClick={() => setStep(2)}
           className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95"
         >
           Thanh toán ngay <Icon icon="solar:arrow-right-bold-duotone" className="text-xl" />
         </button>
      </div>
    </div>
  )

  const renderStep2_Checkout = () => (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-[calc(100vh-140px)]"
    >
      <div className="flex-1 overflow-y-auto px-4 py-2 pb-10 space-y-6">
         {/* Address prepopulated */}
         <div>
           <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
             <Icon icon="solar:map-point-bold-duotone" className="text-primary text-xl" /> Địa chỉ nhận hàng
           </h3>
           <textarea 
             className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-2 ring-primary/20"
             rows={3}
             value={address}
             onChange={(e) => setAddress(e.target.value)}
           ></textarea>
         </div>

         {/* Discount Code */}
         <div>
           <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
             <Icon icon="solar:ticket-sale-bold-duotone" className="text-orange-500 text-xl" /> Khuyến mãi
           </h3>
           <div className="flex gap-2">
             <input 
               type="text" 
               placeholder="Nhập mã WOW" 
               value={discountCode}
               onChange={e => setDiscountCode(e.target.value)}
               className="flex-1 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 uppercase"
             />
             <button onClick={handleApplyDiscount} className="bg-gray-800 text-white font-bold px-6 rounded-xl hover:bg-black transition-colors">
               Áp dụng
             </button>
           </div>
         </div>

         {/* Payment Methods */}
         <div>
           <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
             <Icon icon="solar:wallet-money-bold-duotone" className="text-blue-500 text-xl" /> Thanh toán
           </h3>
           <div className="space-y-3">
             <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:bg-gray-50'}`}>
               <input type="radio" name="payment" className="w-5 h-5 accent-primary" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
               <Icon icon="solar:hand-money-bold-duotone" className="text-3xl text-emerald-500" />
               <span className="font-bold text-gray-800 text-sm">Thanh toán tiền mặt (COD)</span>
             </label>
             <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'MOMO' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:bg-gray-50'}`}>
               <input type="radio" name="payment" className="w-5 h-5 accent-primary" checked={paymentMethod === 'MOMO'} onChange={() => setPaymentMethod('MOMO')} />
               <Icon icon="logos:mo-mo" className="text-3xl" />
               <span className="font-bold text-gray-800 text-sm">MoMo E-Wallet</span>
             </label>
           </div>
         </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl mt-auto">
         <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 font-medium">Tạm tính ({items.length} món)</span>
            <span className="font-bold text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
         </div>
         {hasDiscount && (
           <div className="flex justify-between items-center mb-2">
              <span className="text-green-500 font-bold text-sm">Giảm giá (Mã WOW)</span>
              <span className="font-bold text-green-500 text-sm">- {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice * 0.2)}</span>
           </div>
         )}
         <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-100">
            <span className="text-gray-900 font-bold text-lg">Tổng cộng</span>
            <span className="text-2xl font-extrabold text-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice)}
            </span>
         </div>
         <button 
           disabled={isOrdering}
           onClick={handleCheckout}
           className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
         >
           {isOrdering ? 'Đang xử lý...' : 'Xác nhận Đặt hàng'}
         </button>
      </div>
    </motion.div>
  )

  const renderStep3_Tracking = () => {
    const statuses = [
      { id: 0, label: 'Đang nấu', icon: 'solar:skillet-bold-duotone', color: 'text-orange-500' },
      { id: 1, label: 'Đang giao', icon: 'solar:scooter-bold-duotone', color: 'text-blue-500' },
      { id: 2, label: 'Đã hoàn thành', icon: 'solar:check-circle-bold-duotone', color: 'text-emerald-500' },
    ]

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-extrabold text-center mb-2">Order #A8X922</h2>
          <p className="text-center text-gray-500 mb-10 text-sm">Đơn hàng của bạn đang được xử lý</p>
          
          <div className="relative border-l-4 border-gray-100 ml-8 space-y-10 pb-8">
             {statuses.map((s, idx) => {
                const isActive = orderStatus >= idx + 1
                return (
                  <div key={idx} className="relative flex items-center">
                    <div className={`absolute -left-[26px] w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-white border-4 border-gray-100 text-gray-300'}`}>
                      <Icon icon={s.icon} className={`text-2xl ${isActive ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className={`ml-12 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-4'}`}>
                      <h4 className={`font-bold text-lg ${isActive ? s.color : 'text-gray-400'}`}>{s.label}</h4>
                      {isActive && idx + 1 === orderStatus && (
                        <p className="text-xs text-gray-500 mt-1">Đang cập nhật thời gian thực...</p>
                      )}
                    </div>
                  </div>
                )
             })}
          </div>

          <button 
            onClick={closeCart}
            className="mt-8 w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors"
          >
            Ẩn đơn hàng này
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Drawer Drawer right on Desktop, Bottom sheet on Mobile */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-[#fafafa] shadow-2xl z-[60] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {step === 2 && (
                    <button onClick={() => setStep(1)} className="p-2 -ml-2 bg-gray-50 rounded-full hover:bg-gray-100">
                      <Icon icon="solar:alt-arrow-left-bold-duotone" className="text-xl" />
                    </button>
                  )}
                  <h2 className="text-xl font-extrabold text-black flex items-center gap-2">
                    {step === 1 ? 'Giỏ hàng của bạn' : step === 2 ? 'Thanh toán' : 'Theo dõi Đơn hàng'}
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Icon icon="solar:close-circle-bold-duotone" className="text-gray-500 text-2xl" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1">
                {items.length === 0 && step === 1 ? renderCartEmpty() : 
                 step === 1 ? renderStep1_Cart() : 
                 step === 2 ? renderStep2_Checkout() : 
                 renderStep3_Tracking()}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default CartDrawer