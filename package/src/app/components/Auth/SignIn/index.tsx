'use client'
import Link from 'next/link'
import SocialSignIn from '../SocialSignIn'
import Logo from '@/app/components/Layout/Header/Logo'
import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const Signin = ({ onSuccess }: { onSuccess?: () => void }) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu!')
      return
    }

    try {
      setLoading(true)
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (res?.error) {
        toast.error('Đăng nhập thất bại: ' + res.error)
      } else {
        toast.success('Đăng nhập thành công!')
        const session: any = await getSession()
        
        if (onSuccess) {
          onSuccess()
        }

        if (session?.user?.role === 'ADMIN') {
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <SocialSignIn />

      <span className='z-1 relative my-8 block text-center  before:absolute before:h-px before:w-[40%] before:bg-black/20 before:left-0 before:top-3  after:absolute after:h-px after:w-[40%] after:bg-black/20 after:top-3 after:right-0'>
        <span className='text-body-secondary relative z-10 inline-block px-3 text-base text-black'>
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className='mb-[22px]'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-9'>
          <button
            disabled={loading}
            type='submit'
            className='bg-primary w-full py-3 rounded-lg text-18 font-medium border text-white border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out disabled:opacity-50'>
            {loading ? 'Đang Sign In...' : 'Sign In'}
          </button>
        </div>
      </form>

      <Link
        href='/'
        className='mb-2 inline-block text-base text-black hover:text-primary  hover:underline'>
        Forgot Password?
      </Link>
      <p className='text-black text-base'>
        Not a member yet?{' '}
        <Link href='/' className='text-primary hover:underline'>
          Sign Up
        </Link>
      </p>
    </>
  )
}

export default Signin
