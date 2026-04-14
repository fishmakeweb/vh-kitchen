'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import { useCart } from '@/app/context/CartContext'
import toast from 'react-hot-toast'
import axiosClient from '@/utils/axiosClient'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  smartComponent?: {
    id: string
    name: string
    price: number
    calories: number
    image: string
  }
}

const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'assistant',
    content: 'Xin chào! Mình là AI Assistant của Đầu bếp. Mình có thể giúp bạn chọn món ngon, rẻ và chuẩn gu. Bạn muốn ăn gì hôm nay?'
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { dispatch } = useCart()

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isTyping])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userText = input.trim()
    setInput('')
    
    // Add User Message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userText }])
    setIsTyping(true)

    try {
      // Call Real AI /api/v1/ai/chat
      const res = await axiosClient.post('/ai/chat', { userInput: userText })
      const aiResponse = res.data?.data || res.data
      
      // Assume the AI may return normal text or text + a smart component card
      setMessages(prev => [...prev, { 
        id: Date.now().toString() + 'ai', 
        role: 'assistant', 
        content: aiResponse.reply || aiResponse.message || aiResponse.content || 'Đây là gợi ý của mình dành cho bạn.',
        smartComponent: aiResponse.suggestedItem ? {
          id: aiResponse.suggestedItem.id || 'ai-gen-id',
          name: aiResponse.suggestedItem.name,
          price: aiResponse.suggestedItem.price,
          calories: aiResponse.suggestedItem.calories || 450,
          image: aiResponse.suggestedItem.imageUrl || '/images/hero/pizza.webp'
        } : undefined
      }])
    } catch (err: any) {
      console.error(err)
      // Fallback for demo when backend is not ready
      setTimeout(() => {
        const isChickenOrCheap = userText.toLowerCase().includes('gà') || userText.toLowerCase().includes('rẻ')
  
        if (isChickenOrCheap) {
          setMessages(prev => [...prev, { 
            id: Date.now().toString() + 'ai_mock', 
            role: 'assistant', 
            content: 'Gà chuẩn vị và cực kỳ tiết kiệm cho bạn đây! (Mock Data do chưa kết nối Model AI)',
            smartComponent: {
              id: 'c1',
              name: 'Combo Gà Giòn Tiết Kiệm',
              price: 50000,
              calories: 400,
              image: '/images/hero/pizza.webp'
            }
          }])
        } else {
          setMessages(prev => [...prev, { 
            id: Date.now().toString() + 'ai_mock', 
            role: 'assistant', 
            content: 'Mình đang tìm kiếm dựa trên khẩu vị của bạn. Xin lỗi nhưng module AI hiện tại đang phản hồi lỗi từ server.'
          }])
        }
      }, 1000)
    } finally {
      setIsTyping(false)
    }
  }

  const handleAddToCart = (item: any) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      },
    })
    toast.success(`Đã thêm ${item.name} vào giỏ hàng`, {
      icon: '🪄',
      position: 'top-center',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    })
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
           <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           exit={{ scale: 0 }}
           className="fixed bottom-6 right-6 z-[45]"
         >
           <button 
             onClick={() => setIsOpen(true)}
             className="relative flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_8px_30px_rgb(139,92,246,0.4)] hover:scale-105 active:scale-95 transition-all text-white border-2 border-white"
           >
             <Icon icon="fluent-emoji-flat:magic-wand" className="text-2xl lg:text-3xl" />
             <div className="absolute top-0 right-0 w-3 h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-full animate-ping" />
           </button>
         </motion.div>         
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50]"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full h-[85vh] lg:h-[600px] lg:w-[380px] lg:left-auto lg:right-6 lg:bottom-6 lg:rounded-3xl bg-[#fafafa] shadow-2xl z-[60] flex flex-col rounded-t-3xl overflow-hidden border border-gray-100"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 flex items-center justify-between text-white shadow-md z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <Icon icon="fluent-emoji-flat:robot" className="text-2xl drop-shadow-md" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight drop-shadow-md">vh kitchen AI Assistant</h3>
                    <p className="text-[11px] text-white/80 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Trực tuyến</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 hover:rotate-90 rounded-full backdrop-blur-sm transition-all">
                  <Icon icon="solar:close-circle-bold-duotone" className="text-xl" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white scrollbar-hide flex flex-col">
                <div className="text-center text-xs text-gray-400 font-medium mt-2 mb-4 shrink-0">Hôm nay</div>
                
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user'
                  return (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex flex-col items-center justify-center mr-2 shrink-0 border border-violet-200 shadow-sm mt-auto mb-1">
                          <Icon icon="fluent-emoji-flat:robot" className="text-sm" />
                        </div>
                      )}
                      
                      <div className={`max-w-[75%] ${isUser ? 'bg-primary text-white rounded-2xl rounded-br-sm' : 'bg-gray-100 border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm text-gray-800'} px-4 py-2.5 text-sm leading-relaxed`} style={{ wordBreak: 'break-word' }}>
                        <p>{msg.content}</p>
                        
                        {/* Smart Component Rendered inside Chat */}
                        {msg.smartComponent && !isUser && (
                          <div className="mt-3 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                            <div className="relative h-28 bg-gray-200 w-[200px] sm:w-[220px] mb-2">
                               <Image src={msg.smartComponent.image} alt="Food" fill className="object-cover" />
                               <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-500 shadow-sm">
                                 <Icon icon="solar:fire-bold-duotone" className="inline mr-0.5" />
                                 {msg.smartComponent.calories} Kcal
                               </div>
                            </div>
                            <div className="px-3 pb-3">
                              <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{msg.smartComponent.name}</h4>
                              <span className="font-extrabold text-primary text-sm inline-block mb-3 border-b-2 border-primary/20 pb-0.5">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.smartComponent.price)}
                              </span>
                              <button 
                                onClick={() => handleAddToCart(msg.smartComponent)}
                                className="w-full bg-purple-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-purple-700 transition flex items-center justify-center gap-1 shadow-md shadow-purple-500/20 active:scale-95"
                              >
                                <Icon icon="solar:cart-plus-bold-duotone" className="text-base" /> Thêm ngay
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mr-2 shrink-0 border border-violet-200 shadow-sm mt-auto mb-1">
                       <Icon icon="fluent-emoji-flat:robot" className="text-sm" />
                    </div>
                    <div className="bg-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center h-10 w-16">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} className="h-1 shrink-0" />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] relative shrink-0">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Gợi ý combo gà rẻ nhất..."
                    className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 text-sm font-medium rounded-full pl-5 pr-14 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-violet-500/20 border border-transparent focus:border-violet-200 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-1 top-1 w-10 h-10 bg-violet-600 disabled:bg-gray-300 disabled:shadow-none text-white rounded-full flex items-center justify-center hover:bg-violet-700 transition shadow-md shadow-violet-500/30"
                  >
                    <Icon icon="solar:round-alt-arrow-right-bold" className="text-xl" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAIChat