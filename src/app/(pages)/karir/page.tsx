'use client'

import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { API_ENDPOINTS } from '@/app/api/api'
import { toast } from 'sonner'
import { KarirTable } from './components/KarirTable'
import KarirDialog from './components/KarirDialog'
import DeleteDialog from './components/DeleteDialog'

interface Career {
  id: number
  image: string | File
  description: string
}

export default function CareerPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [careerToDelete, setCareerToDelete] = useState<Career | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.CAREER)

      if (!response.ok) {
        throw new Error('Gagal mengambil data karir')
      }

      const data: { success: boolean; data: Career[] } = await response.json()
      setCareers(data.data)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error('Gagal memuat data karir')
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
        toast.error('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  // Filter careers based on search
  const filteredCareers = careers.filter(career =>
    career.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingCareer(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (career: Career) => {
    setEditingCareer(career)
    setIsDialogOpen(true)
  }

  const handleDelete = (career: Career) => {
    setCareerToDelete(career)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Career, 'id'>) => {
    try {
      setSaving(true)

      const data = new FormData()

      data.append('description', formData.description)

      if (formData.image instanceof File) {
        data.append('image', formData.image)
      }

      if (typeof formData.image === 'string' && !formData.image.startsWith('data:image')) {
        data.append('old_image', formData.image)
      }

      let response: Response;

      if (editingCareer) {
        data.append('_method', 'PUT')

        response = await fetch(API_ENDPOINTS.CAREER_BY_ID(editingCareer.id), {
          method: 'POST',
          body: data,
        })
      } else {
        response = await fetch(API_ENDPOINTS.CAREER, {
          method: 'POST',
          body: data,
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menyimpan data karir')
      }

      const result = await response.json()

      if (result.success) {
        toast.success(editingCareer ? 'Karir berhasil diupdate' : 'Karir berhasil ditambahkan')
        await fetchCareers()
        setIsDialogOpen(false)
        setEditingCareer(null)
      } else {
        throw new Error(result.message || 'Gagal menyimpan data karir')
      }

    } catch (err: unknown) {
      console.error('Error saving karir:', err)
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
    if (!careerToDelete) return

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.CAREER_BY_ID(careerToDelete.id), {
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
        await fetchCareers()
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
      setCareerToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Karir</h1>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Lowongan
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari lowongan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <KarirTable
        careers={filteredCareers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Dialog */}
      <KarirDialog
        key={editingCareer ? editingCareer.id : "new"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        career={editingCareer}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        career={careerToDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}
