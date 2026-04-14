import axios from 'axios'
import { getSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add the auth token to every request
axiosClient.interceptors.request.use(
  async (config) => {
    // We only use getSession on the client-side
    if (typeof window !== 'undefined') {
      const session: any = await getSession()
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
      }
    }
    
    // Support multipart/form-data dynamic switching
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle common errors across the app
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // 400 Bad Request usually means validation errors from NestJS
    if (status === 400) {
      const message = Array.isArray(data?.message) ? data.message[0] : data?.message || 'Có lỗi xảy ra với dữ liệu'
      toast.error(message)
    }

    // 401 Unauthorized
    else if (status === 401) {
      toast.error('Phiên đăng nhập hết hạn hoặc không hợp lệ.')
      // Option: Trigger next-auth signout here or attempt silent refresh if we configure refresh tokens
    }

    // 403 Forbidden
    else if (status === 403) {
      toast.error('Bạn không có quyền thực hiện hành động này.')
    }

    // 404 Not Found
    else if (status === 404) {
      toast.error('Không tìm thấy dữ liệu yêu cầu.')
    }

    // 429 Too Many Requests (Rate limit)
    else if (status === 429) {
      toast.error('Thực hiện quá nhiều thao tác. Vui lòng thử lại sau.')
    }

    // 500 Internal Server Error
    else if (status >= 500) {
      toast.error('Lỗi hệ thống tĩnh. Vui lòng thử lại sau.')
    }

    return Promise.reject(error)
  }
)

export default axiosClient