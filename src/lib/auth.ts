import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password_hash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { role: true, id: true }
        })

        if (dbUser) {
          (session.user as any).role = dbUser.role as string
          (session.user as any).id = dbUser.id
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Check if user exists, if not create with default role
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! }
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email!,
            username: user.email!.split('@')[0], // Default username
            password_hash: '', // Not used with Auth0
            role: 'CREATOR', // Default role
          }
        })
      }

      return true
    },
  },
  pages: {
    signIn: '/login',
  },
}