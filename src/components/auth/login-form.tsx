'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect jika sudah login
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validasi input
      if (!formData.email || !formData.password) {
        setError('Email dan password harus diisi')
        return
      }

      const success = await login(formData.email, formData.password)

      if (success) {
        router.push('/dashboard')
      } else {
        setError('Email atau password salah')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Terjadi kesalahan saat login. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  // Show loading while checking auth
  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
            <Shield className="h-6 w-6 text-orange-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">Memeriksa autentikasi</p>
            <p className="text-sm text-gray-600 mt-1">Harap tunggu sebentar...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-linear-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Header untuk mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Image
                src="/images/logo-tursina.png"
                alt="Tursina Kebab Logo"
                width={80}
                height={80}
                className="object-contain p-2"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tursina Kebab</h1>
            <p className="text-gray-600 mt-1">Admin Management System</p>
          </div>

          <Card className="border-0 shadow-xl rounded-2xl backdrop-blur-sm bg-white/70">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Masuk ke Dashboard
              </CardTitle>
            </CardHeader>

            <CardContent className="pb-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                  <div className="shrink-0">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                  </div>
                  <p className="text-sm text-red-700 flex-1">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Alamat Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <LogIn className="h-5 w-5" />
                      <span>Masuk ke Dashboard</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Brand Showcase */}
      <div className="flex-1 bg-linear-to-br from-orange-500 to-orange-600 hidden lg:flex items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="text-white text-center relative z-10 max-w-2xl">
          {/* Large Logo Container */}
          <div className="w-64 h-64 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-white/20 backdrop-blur-sm">
            <Image
              src="/images/logo-tursina.png"
              alt="Tursina Kebab Logo"
              className="object-contain p-6"
              width={400}
              height={400}
              priority
            />
          </div>

          {/* Brand Name */}
          <h1 className="text-5xl font-bold mb-4 text-white tracking-tight">
            Tursina Kebab
          </h1>

          {/* Tagline */}
          <p className="text-orange-100 bottom-8 mb-8 font-light tracking-wide text-sm">
            © 2025 Tursina Kebab. All rights reserved.
          </p>

          {/* Copyright */}
          {/* <div className="text-center bottom-8 left-1/2 transform -translate-x-1/2">
            <p className="text-orange-200 text-sm">
              © 2024 Tursina Kebab. All rights reserved.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  )
}