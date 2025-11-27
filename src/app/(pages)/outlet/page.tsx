'use client'

import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { API_ENDPOINTS } from '@/app/api/api'
import { toast } from 'sonner'
import OutletTable from './components/OutletTable'
import { OutletDialog } from './components/OutletDialog'
import { DeleteDialog } from './components/DeleteDialog'

interface Outlet {
  id: number
  location: string
  link: string
}

export default function OutletPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [outletToDelete, setOutletToDelete] = useState<Outlet | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)


  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.OUTLET)

      if (!response.ok) {
        throw new Error('Gagal mengambil data outlet')
      }

      const data: { success: boolean; data: Outlet[] } = await response.json()
      setOutlets(data.data)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error('Gagal memuat data outlet')
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
        toast.error('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  // Filter outlets based on search
  const filteredOutlets = outlets.filter(outlet =>
    outlet.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingOutlet(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet)
    setIsDialogOpen(true)
  }

  const handleDelete = (outlet: Outlet) => {
    setOutletToDelete(outlet)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Outlet, 'id'>) => {
    try {
      setSaving(true)

      const data = new FormData()

      data.append('location', formData.location)
      data.append('link', formData.link)

      let response: Response;

      if (editingOutlet) {
        data.append('_method', 'PUT')

        response = await fetch(API_ENDPOINTS.OUTLET_BY_ID(editingOutlet.id), {
          method: 'POST',
          body: data,
        })
      } else {
        response = await fetch(API_ENDPOINTS.OUTLET, {
          method: 'POST',
          body: data,
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menyimpan data outlet')
      }

      const result = await response.json()

      if (result.success) {
        toast.success(editingOutlet ? 'Outlet berhasil diupdate' : 'Outlet berhasil ditambahkan')
        await fetchOutlets()
        setIsDialogOpen(false)
        setEditingOutlet(null)
      } else {
        throw new Error(result.message || 'Gagal menyimpan data outlet')
      }

    } catch (err: unknown) {
      console.error('Error saving outlet:', err)
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
    if (!outletToDelete) return

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.OUTLET_BY_ID(outletToDelete.id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menghapus outlet')
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Outlet berhasil dihapus')
        await fetchOutlets()
      } else {
        throw new Error(result.message || 'Gagal menghapus outlet')
      }

    } catch (err: unknown) {
      console.error('Error deleting outlet:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat menghapus outlet')
      }
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setOutletToDelete(null)
    }
  }


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outlet</h1>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Outlet
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari outlet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <OutletTable
        outlets={filteredOutlets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Dialog */}
      <OutletDialog
        key={editingOutlet ? editingOutlet.id : "new"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        outlet={editingOutlet}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        outlet={outletToDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}

