/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from 'react'
import { 
  Users, 
  Store, 
  Globe, 
} from "lucide-react"
import axios, { AxiosError } from 'axios'

interface TopMember {
  id: number
  name: string
  points: number
  outlet: string
}

interface DashboardStats {
  total_web_visits: number
  total_members: number
  total_outlets: number
  total_menus: number
  web_visits_change: number
  members_change: number
}

interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    total_web_visits: 0,
    total_members: 0,
    total_outlets: 0,
    total_menus: 0,
    web_visits_change: 0,
    members_change: 0
  })
  const [topMembers, setTopMembers] = useState<TopMember[]>([])
  const [error, setError] = useState('')

  // Setup axios
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': 'application/json'
    }
  })

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      // Ambil semua data sekaligus
      const [statsRes, membersRes] = await Promise.all([
        api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
        api.get<ApiResponse<TopMember[]>>('/dashboard/top-members?limit=5')
      ])

      setStats(statsRes.data.data)
      setTopMembers(membersRes.data.data)
      
    } catch (err: unknown) {
      console.error('Error:', err)
      
      // Handle error dengan tipe yang tepat
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Gagal memuat data')
      } else if (err instanceof Error) {
        setError(err.message || 'Gagal memuat data')
      } else {
        setError('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Format number
  const formatNum = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  // Stats cards
  const statCards = [
    {
      title: "Kunjungan Web",
      value: formatNum(stats.total_web_visits),
      change: stats.web_visits_change,
      icon: Globe,
      color: "blue"
    },
    {
      title: "Total Member",
      value: formatNum(stats.total_members),
      change: stats.members_change,
      icon: Users,
      color: "green"
    },
    {
      title: "Total Outlet",
      value: formatNum(stats.total_outlets),
      change: stats.total_outlets,
      icon: Store,
      color: "purple"
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                {/* <div className="flex items-center mt-2">
                  <span className={`text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs bulan lalu</span>
                </div> */}
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Members */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Top 5 Member</h2>
        
        {topMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada data member</p>
        ) : (
          <div className="space-y-3">
            {topMembers.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.outlet}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatNum(member.points)}</p>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Tips Hari Ini</h3>
          <p className="text-blue-700">
            Tingkatkan engagement member dengan program loyalty. Member aktif memberikan 3x lebih banyak revenue.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">📊 Statistik Singkat</h3>
          <p className="text-green-700">
            Rata-rata kunjungan web per hari: {formatNum(Math.round(stats.total_web_visits / 30))}
          </p>
        </div>
      </div>
    </div>
  )
}