import { Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/Layout/Header'
import Footer from '@/app/components/Layout/Footer'
import { Providers } from './Providers'
import { Toaster } from 'react-hot-toast'
import CartDrawer from '@/app/components/Order/CartDrawer'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className}`}>
        <Providers>
          <Toaster position="top-center" />
          <Header />
          <CartDrawer />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
