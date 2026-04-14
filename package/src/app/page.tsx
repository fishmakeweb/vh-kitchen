import React from 'react'
import Hero from '@/app/components/Home/Hero'
import TripleThreat from '@/app/components/Home/TripleThreat'
import MobileMenu from '@/app/components/Home/MobileMenu'
import CrossSellHero from '@/app/components/Home/CrossSellHero'
import FloatingAIChat from '@/app/components/SharedComponent/FloatingAIChat'
import QuickOrderFast from '@/app/components/Home/QuickOrderFast'
import Gallery from '@/app/components/Home/Gallery'
import Newsletter from '@/app/components/Home/Newsletter'
import { Metadata } from 'next'
import ContactForm from './components/Contact/Form'
export const metadata: Metadata = {
  title: 'vh kitchen - Đặt đồ ăn nhanh chóng',
}

export default function Home() {
  return (
    <main className="bg-gray-50 pb-20 lg:pb-0"> {/* pb-20 for mobile FAB space */}
      {/* <FlashSaleHero /> - to implement */}
      <Hero /> 
      {/* Categories Bar & Grid integrated in MobileMenu */}
      <MobileMenu />
      <QuickOrderFast />

      <FloatingAIChat />
      
      {/* Old sections below, keep them for reference/desktop */}
      {/* <TripleThreat /> */}
      {/* <CrossSellHero /> */}
      {/* <Gallery /> */}
      {/* <ContactForm /> */}
      {/* <Newsletter /> */}
    </main>
  )
}
