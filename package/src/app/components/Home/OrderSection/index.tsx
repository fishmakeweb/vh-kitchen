'use client'

import React, { useState } from 'react'

const sizes = [
  { id: 'S', name: 'Size S (20cm)', price: '120.000đ', desc: 'Đáy mỏng, 1 người ăn' },
  { id: 'M', name: 'Size M (26cm)', price: '190.000đ', desc: 'Viền phô mai, 2-3 người ăn', popular: true },
  { id: 'L', name: 'Size L (32cm)', price: '280.000đ', desc: 'Tràn viền, 4-5 người ăn' },
]

const OrderSection = () => {
  const [selectedSize, setSelectedSize] = useState('M')

  return (
    <section className="py-20 bg-white relative z-10" id="order-section">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-black mb-4">Bạn đã sẵn sàng để thử thách?</h2>
          <p className="text-gray-500 text-lg mb-12">
            Chọn kích cỡ phù hợp với bạn và nhóm để bắt đầu trải nghiệm kéo phô mai bất tận.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {sizes.map((size) => (
              <div 
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedSize === size.id 
                    ? 'border-[#FFC107] bg-yellow-50 shadow-[0_10px_20px_rgba(255,193,7,0.2)]' 
                    : 'border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                {size.popular && (
                  <div className="flex justify-center mb-4">
                     <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                       Best Seller
                     </span>
                  </div>
                )}
                <div className={`w-20 h-20 mx-auto rounded-full bg-gray-100 mb-4 flex items-center justify-center text-4xl bg-cover bg-center ${selectedSize === size.id ? 'ring-4 ring-[#FFC107] ring-offset-2' : ''}`} style={{ backgroundImage: "url('/images/hero/pizza.webp')" }}>
                   {/* Fallback texture if image missing */}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{size.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{size.desc}</p>
                <div className="text-2xl font-black text-primary">{size.price}</div>
              </div>
            ))}
          </div>

          <button className="text-2xl font-bold rounded-full text-black py-5 px-16 bg-[#FFC107] hover:bg-yellow-400 shadow-[0_10px_30px_rgba(255,193,7,0.3)] hover:shadow-[0_15px_40px_rgba(255,193,7,0.5)] transform hover:scale-105 transition ease-in-out duration-300 w-full md:w-auto">
            Thêm vào giỏ hàng ngay!
          </button>
        </div>
      </div>
    </section>
  )
}

export default OrderSection