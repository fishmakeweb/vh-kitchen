'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'
import Signin from '@/app/components/Auth/SignIn'
import SignUp from '@/app/components/Auth/SignUp'
import { Icon } from '@iconify/react/dist/iconify.js'
import { HeaderItem } from '@/app/types/menu'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/app/context/CartContext'

const Header: React.FC = () => {
  const { data: session, status } = useSession()
  const { state: cartState, dispatch } = useCart()
  const [headerLink, setHeaderLink] = useState<HeaderItem[]>([])

  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const navbarRef = useRef<HTMLDivElement>(null)
  const signInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setHeaderLink(data.HeaderData)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchData()
  }, [])

  const handleScroll = () => {
    setSticky(window.scrollY >= 20)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false)
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false)
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target as Node)
    ) {
      setIsProfileOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen])

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  return (
    <header
      className={`fixed top-0 z-40 py-4 w-full transition-all duration-300 ${
        sticky ? 'shadow-lg bg-white' : 'shadow-none'
      }`}>
      <div>
        <div className='container flex items-center justify-between'>
          <div className='lg:w-[400px]'>
            <Logo />
          </div>
          
            <div className='flex items-center gap-2 lg:gap-3 lg:justify-end xl:w-[400px]'>
            
            {/* Cart Icon */}
            <div 
              className="relative mr-2 cursor-pointer hover:scale-105 transition-transform" 
              aria-label="Cart"
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            >
              <div className="p-2 bg-gray-100 rounded-full text-black">
                 <Icon icon="solar:cart-large-minimalistic-bold-duotone" className="text-2xl" />
              </div>
              {cartState.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white">
                  {cartState.totalItems}
                </span>
              )}
            </div>

            {status === 'loading' ? (
              <span className="hidden lg:block text-gray-400">Loading...</span>
            ) : session ? (
              <div className="relative hidden lg:block" ref={profileDropdownRef}>
                <div 
                  className="flex items-center justify-center gap-3 px-3 py-1.5 rounded-full cursor-pointer transition-colors group"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-500 font-medium">Hi, {session.user?.name?.split(' ')[0] || 'User'}!</span>
                    <span className="text-sm font-bold text-black leading-none max-w-[120px] truncate group-hover:text-primary transition-colors">Hôm nay ăn gì?</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary group-hover:border-primary/50 shadow-sm font-bold text-lg">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                  </div>
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:user-circle-bold-duotone" className="text-xl" />
                        Edit Profile
                      </div>
                    </Link>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:chart-square-bold-duotone" className="text-xl" />
                          Dashboard
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        signOut()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:logout-2-bold-duotone" className="text-xl" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className='hidden lg:block text-primary duration-300 bg-primary/15 hover:text-white hover:bg-primary font-medium text-lg py-2 px-6 rounded-full hover:cursor-pointer'
                  onClick={() => {
                    setIsSignInOpen(true)
                  }}>
                  Sign In
                </button>
                <button
                  className='hidden lg:block bg-primary duration-300 text-white hover:bg-primary/15 hover:text-primary font-medium text-lg py-2 px-6 rounded-full hover:cursor-pointer'
                  onClick={() => {
                    setIsSignUpOpen(true)
                  }}>
                  Sign Up
                </button>
              </>
            )}
            {isSignInOpen && (
              <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signInRef}
                  className='relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-white'>
                  <button
                    onClick={() => setIsSignInOpen(false)}
                    className='absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer'
                    aria-label='Close Sign In Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-primary text-24 inline-block me-2'
                    />
                  </button>
                  <Signin onSuccess={() => setIsSignInOpen(false)} />
                </div>
              </div>
            )}
            {isSignUpOpen && (
              <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signUpRef}
                  className='relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-dark_grey/90 bg-white backdrop-blur-md px-8 pt-14 pb-8 text-center'>
                  <button
                    onClick={() => setIsSignUpOpen(false)}
                    className='absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer'
                    aria-label='Close Sign Up Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-primary text-24 inline-block me-2'
                    />
                  </button>
                  <SignUp />
                </div>
              </div>
            )}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block p-2 rounded-lg'
              aria-label='Toggle mobile menu'>
              <span className='block w-6 h-0.5 bg-black'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )}
        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}>
          <div className='flex items-center justify-between gap-2 p-4'>
            <div>
              <Logo />
            </div>
            {/*  */}
            <button
              onClick={() => setNavbarOpen(false)}
              className="hover:cursor-pointer"
              aria-label='Close menu Modal'>
              <Icon
                icon='material-symbols:close-rounded'
                width={24}
                height={24}
                className='text-black hover:text-primary text-24 inline-block me-2'
              />
            </button>
          </div>
          <Link
            href='#'
            className='text-lg font-medium hover:text-primary block md:hidden mt-6 p-4'>
            <Icon
              icon='solar:phone-bold'
              className='text-primary text-3xl lg:text-2xl inline-block me-2'
            />
            +1(909) 235-9814
          </Link>
          <nav className='flex flex-col items-start p-4'>
            {headerLink.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
            <div className='mt-4 flex flex-col space-y-4 w-full'>
              {status === 'loading' ? (
                <span className="text-gray-400">Loading...</span>
              ) : session ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center border-2 border-primary font-bold text-xl">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">Hi, {session.user?.name?.split(' ')[0] || 'User'}!</span>
                      <span className="font-bold text-black text-sm">Hôm nay ăn gì?</span>
                    </div>
                  </div>
                  <button
                    className='bg-red-500 text-white w-full px-4 py-3 rounded-lg border border-red-500 hover:text-red-500 hover:bg-transparent hover:cursor-pointer transition duration-300 font-bold'
                    onClick={() => {
                      signOut()
                      setNavbarOpen(false)
                    }}>
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className='bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                    onClick={() => {
                      setIsSignInOpen(true)
                      setNavbarOpen(false)
                    }}>
                    Sign In
                  </button>
                  <button
                    className='bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                    onClick={() => {
                      setIsSignUpOpen(true)
                      setNavbarOpen(false)
                    }}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
