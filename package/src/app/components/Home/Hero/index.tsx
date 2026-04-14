'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Hero = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section id='home-section' className='relative bg-gray-50 overflow-hidden lg:bg-transparent'>
      {/* 
        ========================================
        MOBILE HERO (Full-screen Background)
        ========================================
      */}
      <div className='lg:hidden relative w-full h-screen'>
        {/* Background Vertical Video */}
        <video
          src='/videos/pizza.mp4'
          autoPlay
          loop
          muted
          playsInline
          className='absolute top-0 left-0 w-full h-full object-cover z-0'
        />
        
        {/* Dark Gradient Overlay for Contrast at the bottom */}
        <div className='absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent z-10' />

        {/* Content Overlay */}
        <div className='absolute bottom-0 left-0 w-full z-20 px-6 pb-20 text-center flex flex-col items-center justify-end h-full'>
          <h1 className='font-extrabold text-white text-5xl mb-6 flex flex-col gap-4'>
            {/* Sequential Animation for "DÀI - VÔ - TẬN" using tailwind animate-pulse as a simple fallback */}
            <span className='animate-pulse uppercase tracking-widest text-[#FFC107] drop-shadow-lg text-6xl'>Dài</span>
            <span className='animate-pulse uppercase tracking-widest text-white drop-shadow-lg text-6xl' style={{animationDelay: '0.3s'}}>Vô</span>
            <span className='animate-pulse uppercase tracking-widest text-primary drop-shadow-lg text-6xl' style={{animationDelay: '0.6s'}}>Tận</span>
          </h1>
          <p className='text-white/90 text-lg mb-8 max-w-sm font-medium'>
            Pizza phô mai kéo dài 1m - Thử thách mọi giới hạn!
          </p>
          <div className='flex flex-col w-full gap-4'>
            <Link href='/#menu' className='w-full'>
              <button className='w-full text-xl font-bold rounded-full text-black py-4 bg-[#FFC107] hover:bg-yellow-400 transition ease-in-out duration-300 shadow-[0_0_20px_rgba(255,193,7,0.4)]'>
                Order Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 
        ========================================
        DESKTOP HERO (Split Layout + Parallax)
        ========================================
      */}
      <div className='hidden lg:block container xl:pt-24 pt-32 pb-16 relative'>
        {/* Parallax Elements (Placeholders for toppings) */}
        {mounted && (
          <div className='absolute inset-0 pointer-events-none z-10 hidden xl:block'>
            <div className='absolute top-20 left-10 text-6xl opacity-70 animate-bounce' style={{animationDuration: '3s'}}>🌿</div>
            <div className='absolute bottom-20 left-32 text-6xl opacity-70 animate-bounce' style={{animationDuration: '4s', animationDelay: '1s'}}>🌶️</div>
            <div className='absolute top-40 right-10 text-6xl opacity-70 animate-pulse'>🍅</div>
            <div className='absolute bottom-1/3 left-1/2 text-5xl opacity-40 animate-pulse'>🧀</div>
          </div>
        )}

        <div className='grid grid-cols-12 items-center gap-10 relative z-20'>
          {/* Left: Vertical Video Container */}
          <div className='col-span-12 lg:col-span-4 flex justify-center relative group lg:col-start-2'>
            {/* Glow effect behind video */}
            <div className='absolute -inset-4 bg-gradient-to-r from-[#FFC107] to-primary opacity-30 blur-2xl group-hover:opacity-60 transition duration-500 rounded-3xl'></div>
            <div className='relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform transition duration-500 hover:scale-[1.02] bg-black'>
              <video
                src='/videos/pizza.mp4'
                autoPlay
                loop
                muted
                playsInline
                className='w-full h-auto max-h-[75vh] object-cover'
              />
              <div className='absolute bg-white/90 backdrop-blur-sm p-4 gap-4 items-center bottom-6 left-6 rounded-2xl shadow-xl flex z-10'>
                 <div className="bg-[#FFC107] text-black w-12 h-12 flex justify-center items-center rounded-full font-bold text-xl">1m</div>
                <p className='text-sm font-bold text-gray-800 uppercase tracking-wide leading-tight'>
                  Phô mai<br />Siêu dài
                </p>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className='col-span-12 lg:col-span-6 pl-4 xl:pl-10'>
            <div className='inline-block px-4 py-2 bg-red-100 text-primary font-bold rounded-full mb-6 uppercase tracking-wider text-sm'>
              🔥 Món mới ra mắt
            </div>
            <h1 className='font-extrabold mb-6 text-black tracking-tight' style={{fontSize: '3.5rem', lineHeight: '1.2'}}>
              Pizza Phô Mai<br/> Kéo Dài 1m
              <span className='block text-primary mt-2'>Thử thách mọi giới hạn!</span>
            </h1>
            <p className='text-gray-600 text-xl font-medium mb-10 max-w-xl'>
              Cảm nhận sự bùng nổ hương vị với lớp phô mai Mozzarella hảo hạng kéo dài lơ lửng, cùng phần topping thượng hạng nướng củi thơm lừng.
            </p>
            <div className='flex items-center gap-6'>
              <Link href='/#menu'>
                <button className='text-xl font-bold rounded-full text-black py-4 px-10 bg-[#FFC107] hover:bg-yellow-400 shadow-[0_10px_30px_rgba(255,193,7,0.3)] hover:shadow-[0_15px_40px_rgba(255,193,7,0.5)] transform hover:-translate-y-1 transition ease-in-out duration-300'>
                  Thêm vào giỏ hàng
                </button>
              </Link>
              <Link href='/#reserve'>
                <button className='text-xl border-2 border-primary rounded-full font-bold py-3.5 px-8 text-primary hover:text-white hover:bg-primary transition ease-in-out duration-300 flex items-center gap-2'>
                  <span>🛒</span> Đặt vòng ngay
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
