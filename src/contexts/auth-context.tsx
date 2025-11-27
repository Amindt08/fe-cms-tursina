'use client'

import { API_ENDPOINTS } from '@/app/api/api'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Auto check session on load (sessionStorage = auto logout on close)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = sessionStorage.getItem('tursina-user')
        const token = sessionStorage.getItem('tursina-token')

        if (!storedUser || !token) {
          setUser(null)
          return
        }

        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success && data.data) {
        const userData: User = {
          id: data.data.id.toString(),
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        }

        // Simpan user & token dalam sessionStorage
        setUser(userData)
        sessionStorage.setItem('tursina-user', JSON.stringify(userData))
        sessionStorage.setItem(
          'tursina-token',
          data.data.token || data.data.access_token
        )

        return true
      } else {
        console.error('Login failed:', data.message)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('tursina-user')
    sessionStorage.removeItem('tursina-token')
  }

  const value = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
