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
import { API_ENDPOINTS } from '@/app/api/api'
import { toast } from 'sonner'
import { GaleriTable } from './components/GaleriTable'
import { GaleriDialog } from './components/GaleriDialog'
import { DeleteDialog } from './components/DeleteDialog'

interface Gallery {
  id: number
  category: string
  image: string | File
  description: string
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.GALERI)

      if (!response.ok) {
        throw new Error('Gagal mengambil data galeri')
      }

      const data: { success: boolean; data: Gallery[] } = await response.json()
      setGalleries(data.data)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error('Gagal memuat data galeri')
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
        toast.error('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || gallery.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(galleries.map(gallery => gallery.category))]

  const handleAdd = () => {
    setEditingGallery(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery)
    setIsDialogOpen(true)
  }

  const handleDelete = (gallery: Gallery) => {
    setGalleryToDelete(gallery)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Gallery, 'id'>) => {
    try {
      setSaving(true)

      const data = new FormData()

      data.append('category', formData.category)
      data.append('description', formData.description)

      if (formData.image instanceof File) {
        data.append('image', formData.image)
      }

      if (typeof formData.image === 'string' && !formData.image.startsWith('data:image')) {
        data.append('old_image', formData.image)
      }

      let response: Response;

      if (editingGallery) {
        data.append('_method', 'PUT')

        response = await fetch(API_ENDPOINTS.GALERI_BY_ID(editingGallery.id), {
          method: 'POST',
          body: data,
        })
      } else {
        response = await fetch(API_ENDPOINTS.GALERI, {
          method: 'POST',
          body: data,
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menyimpan data galeri')
      }

      const result = await response.json()

      if (result.success) {
        toast.success(editingGallery ? 'Galeri berhasil diupdate' : 'Galeri berhasil ditambahkan')
        await fetchGalleries()
        setIsDialogOpen(false)
        setEditingGallery(null)
      } else {
        throw new Error(result.message || 'Gagal menyimpan data galeri')
      }

    } catch (err: unknown) {
      console.error('Error saving galeri:', err)
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
    if (!galleryToDelete) return

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.GALERI_BY_ID(galleryToDelete.id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menghapus galeri')
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Galeri berhasil dihapus')
        await fetchGalleries()
      } else {
        throw new Error(result.message || 'Gagal menghapus galeri')
      }

    } catch (err: unknown) {
      console.error('Error deleting galeri:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat menghapus galeri')
      }
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setGalleryToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Galeri</h1>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Foto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari foto..."
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
      <GaleriTable
        galleries={filteredGalleries}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Dialog */}
      <GaleriDialog
        key={editingGallery ? editingGallery.id : "new"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        gallery={editingGallery}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        gallery={galleryToDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}