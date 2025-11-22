"use client"

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  Store,
  DollarSign,
  Utensils,
  ArrowUp,
  ArrowDown,
  Tag
} from "lucide-react"

// Mock data untuk dashboard
const dashboardData = {
  stats: [
    {
      title: "Total Pendapatan",
      value: "Rp 45.2 Jt",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Bulan ini"
    },
    {
      title: "Total Pengguna",
      value: "2,845",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "Member aktif"
    },
    {
      title: "Total Outlet",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Store,
      description: "Aktif"
    },
    {
      title: "Menu Terjual",
      value: "8,452",
      change: "-3.1%",
      trend: "down",
      icon: Utensils,
      description: "Bulan ini"
    }
  ],
  recentOrders: [
    { id: "ORD-001", customer: "Ahmad Susanto", amount: "Rp 85.000", status: "completed", time: "10:30 AM" },
    { id: "ORD-002", customer: "Siti Rahayu", amount: "Rp 120.000", status: "completed", time: "10:45 AM" },
    { id: "ORD-003", customer: "Budi Santoso", amount: "Rp 65.000", status: "pending", time: "11:15 AM" },
    { id: "ORD-004", customer: "Maya Indah", amount: "Rp 95.000", status: "completed", time: "11:30 AM" },
    { id: "ORD-005", customer: "Rizki Pratama", amount: "Rp 150.000", status: "completed", time: "11:45 AM" }
  ],
  topMenu: [
    { name: "Kebab Regular", sales: 1245, revenue: "Rp 12.4 Jt" },
    { name: "Kebab Jumbo", sales: 856, revenue: "Rp 15.2 Jt" },
    { name: "Kebab Mini", sales: 723, revenue: "Rp 5.8 Jt" },
    { name: "French Fries", sales: 645, revenue: "Rp 4.5 Jt" },
    { name: "Soft Drink", sales: 589, revenue: "Rp 2.9 Jt" }
  ]
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">

      <main className="flex-1 p-6 bg-gray-50">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">{stat.description}</span>
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status === 'completed' ? 'Selesai' : 'Menunggu'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Menu */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Menu Terpopuler</h2>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.topMenu.map((menu, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-red-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{menu.name}</p>
                      <p className="text-sm text-gray-600">{menu.sales} terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{menu.revenue}</p>
                    <p className="text-sm text-gray-500">Pendapatan</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
              <Utensils className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Tambah Menu</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
              <Tag className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Buat Promo</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
              <Store className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Kelola Outlet</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
              <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Lihat Laporan</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}