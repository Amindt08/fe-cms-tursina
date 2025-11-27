'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MenuTable } from './components/MenuTable'
import { MenuDialog } from './components/MenuDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { API_ENDPOINTS } from '@/app/api/api'
import { toast } from 'sonner'

interface Menu {
  id: number
  menu_name: string
  image: string | File
  details: string
  price: number
  category: string
  status: 'active' | 'inactive'
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.MENU_TURSINA)

      if (!response.ok) {
        throw new Error('Gagal mengambil data menu')
      }

      const data: { success: boolean; data: Menu[] } = await response.json()
      setMenus(data.data)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error('Gagal memuat data menu')
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
        toast.error('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.menu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || menu.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(menus.map(menu => menu.category))]

  const handleAdd = () => {
    setEditingMenu(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu)
    setIsDialogOpen(true)
  }

  const handleDelete = (menu: Menu) => {
    setMenuToDelete(menu)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Menu, 'id'>) => {
    try {
      setSaving(true)

      const data = new FormData()

      data.append('menu_name', formData.menu_name)
      data.append('category', formData.category)
      data.append('price', String(formData.price))
      data.append('details', formData.details)
      data.append('status', formData.status === 'active' ? 'active' : 'inactive')

      if (formData.image instanceof File) {
        data.append('image', formData.image)
      }

      if (typeof formData.image === 'string' && !formData.image.startsWith('data:image')) {
        data.append('old_image', formData.image)
      }

      let response: Response;

      if (editingMenu) {
        data.append('_method', 'PUT')

        response = await fetch(API_ENDPOINTS.MENU_BY_ID(editingMenu.id), {
          method: 'POST',
          body: data,
        })
      } else {
        response = await fetch(API_ENDPOINTS.MENU_TURSINA, {
          method: 'POST',
          body: data,
        })
      }

      if (!response.ok) {
        let errorMessage = 'Gagal menyimpan data menu'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          const errorText = await response.text()
          
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      let result
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        console.log('Response text:', text)
        result = { success: true }
      }

      if (result.success !== false) {
        toast.success(editingMenu ? 'Menu berhasil diupdate' : 'Menu berhasil ditambahkan')
        await fetchMenus()
        setIsDialogOpen(false)
        setEditingMenu(null)
      } else {
        throw new Error(result.message || 'Gagal menyimpan data menu')
      }

    } catch (err: unknown) {
      console.error('Error saving menu:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat menyimpan data')
      }
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!menuToDelete) return

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.MENU_BY_ID(menuToDelete.id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menghapus menu')
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Menu berhasil dihapus')
        await fetchMenus()
      } else {
        throw new Error(result.message || 'Gagal menghapus menu')
      }

    } catch (err: unknown) {
      console.error('Error deleting menu:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat menghapus data')
      }
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setMenuToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Tursina</h1>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Menu
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Kategori: {selectedCategory === 'all' ? 'Semua' : selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map(category => (
              <DropdownMenuItem
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Semua Kategori' : category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <MenuTable
        menus={filteredMenus}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Dialog */}
      <MenuDialog
        key={editingMenu ? editingMenu.id : "new"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        menu={editingMenu}
        onSave={handleSave}
        saving={saving}
      />


      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        menu={menuToDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}