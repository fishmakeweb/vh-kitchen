import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
        // Add fake google credentials fields for bypassing frontend flow when redirecting back from backend
        token: { label: 'Backend Token', type: 'text' },
        profileId: { label: 'Backend Profile', type: 'text' },
        authId: { label: 'Backend Auth', type: 'text' },
        name: { label: 'Name', type: 'text'}
      },
      async authorize(credentials) {
        // Special case: Frontend uses credentials to inject NestJS Google token
        if (credentials?.token) {
          try {
            // Parse JWT to extract email and sub
            const payloadBase64 = credentials.token.split('.')[1];
            const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
            const decoded = JSON.parse(payloadJson);
            
            let role = decoded.role || 'user'
            try {
              const adminsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/profile/admins`, {
                headers: { Authorization: `Bearer ${credentials.token}` }
              })
              const adminsList = adminsRes.data?.data || adminsRes.data || []
              if (Array.isArray(adminsList)) {
                if (adminsList.some((admin: any) => admin.accountId === decoded.sub || admin.email === (decoded.email || credentials.email))) {
                  role = 'ADMIN'
                }
              }
            } catch (adminErr) {}
            
            return {
              id: decoded.sub || '0',
              email: decoded.email || credentials.email || '',
              name: credentials.name || decoded.email?.split('@')[0] || 'User',
              accessToken: credentials.token,
              profileId: credentials.profileId || decoded.sub || '0',
              role: role
            }
          } catch (err) {
            console.error('Invalid token payload', err);
            return null;
          }
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập Email và Mật khẩu.')
        }

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          })

          // NestJS trả về accessToken, authId, profileId bên trong res.data.data
          const responseBody = res.data
          const userData = responseBody?.data

          if (userData && userData.access_token) {
            // Extract authId from access_token's sub
            let authId = '0'
            let role = 'user'
            try {
               const payload = JSON.parse(Buffer.from(userData.access_token.split('.')[1], 'base64').toString('utf-8'))
               authId = payload.sub || '0'
               role = payload.role || userData.profile?.role || 'user'
               
               // Check if user is in admins list using /profile/admins
               try {
                 const adminsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/profile/admins`, {
                   headers: { Authorization: `Bearer ${userData.access_token}` }
                 })
                 const adminsList = adminsRes.data?.data || adminsRes.data || []
                 if (Array.isArray(adminsList)) {
                   const isAdmin = adminsList.some((admin: any) => admin.accountId === authId || admin.id === userData.profile?.id || admin.email === credentials.email)
                   if (isAdmin) {
                     role = 'ADMIN'
                   }
                 }
               } catch (adminErr) {}
               
            } catch (e) {}

            return {
              id: authId,
              email: credentials.email,
              name: userData.profile?.name || credentials.email.split('@')[0],
              accessToken: userData.access_token,
              profileId: userData.profile?.id || '0',
              role: role,
            }
          }
          return null
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.'
          throw new Error(errorMessage)
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in
        const u = user as any
        token.accessToken = u.accessToken
        token.profileId = u.profileId
        token.userId = u.id
        token.role = u.role
      }
      return token
    },
    async session({ session, token }) {
      // Pass token info down to the client session
      const newSession = {
        ...session,
      } as any

      newSession.accessToken = token.accessToken
      newSession.profileId = token.profileId
      newSession.user.id = token.userId
      newSession.user.role = token.role

      return newSession
    },
  },
  pages: {
    signIn: '/signin', // Tuỳ chọn redirect nếu login cần thiết trên form Next.js base
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret-key-fallback',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }