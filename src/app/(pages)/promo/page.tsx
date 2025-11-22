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
import { DeleteDialog } from './components/DeleteDialog'
import { API_ENDPOINTS } from '@/app/api/api'
import { toast } from 'sonner'
import { PromoTable } from './components/PromoTable'
import { PromoDialog } from './components/PromoDialog'

interface Promo {
  id: number
  promo_name: string
  image: string | File
  status: 'active' | 'inactive'
}

/** Helper aman untuk mengambil pesan error */
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === "string") return err
  try {
    return JSON.stringify(err)
  } catch {
    return "Terjadi kesalahan yang tidak diketahui"
  }
}

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState<Promo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPromos()
  }, [])

  const fetchPromos = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.PROMO)

      if (!response.ok) {
        throw new Error("Gagal mengambil data promo")
      }

      const data: { success: boolean; data: Promo[] } = await response.json()
      setPromos(data.data)

    } catch (err: unknown) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPromos = promos.filter(promo => {
    const matchesSearch = promo.promo_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || promo.status === selectedStatus
    return matchesSearch && matchesStatus
  })

const statusOptions = [
  "all",
  ...Array.from(new Set(promos.map((p) => p.status))),
] as Array<"all" | "active" | "inactive">;

  const handleAdd = () => {
    setEditingPromo(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo)
    setIsDialogOpen(true)
  }

  const handleDelete = (promo: Promo) => {
    setPromoToDelete(promo)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Promo, 'id'>) => {
    try {
      setSaving(true)

      const data = new FormData()
      data.append('promo_name', formData.promo_name)
      data.append('status', formData.status)

      if (formData.image instanceof File) {
        data.append('image', formData.image)
      }

      if (typeof formData.image === 'string' && !formData.image.startsWith('data:image')) {
        data.append('old_image', formData.image)
      }

      let response: Response;

      if (editingPromo) {
        response = await fetch(API_ENDPOINTS.PROMO_BY_ID(editingPromo.id), {
          method: 'POST',
          body: data
        })
      } else {
        response = await fetch(API_ENDPOINTS.PROMO, {
          method: 'POST',
          body: data
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menyimpan data promo')
      }

      const result = await response.json()

      if (result.success) {
        toast.success(editingPromo ? 'Promo berhasil diupdate' : 'Promo berhasil ditambahkan')
        await fetchPromos()
        setIsDialogOpen(false)
        setEditingPromo(null)
      } else {
        throw new Error(result.message || 'Gagal menyimpan data promo')
      }

    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!promoToDelete) return

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.PROMO_BY_ID(promoToDelete.id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menghapus promo')
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Promo berhasil dihapus')
        await fetchPromos()
      } else {
        throw new Error(result.message || 'Gagal menghapus promo')
      }

    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setPromoToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Promo Tursina</h1>
        <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Promo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari promo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Status: {selectedStatus === "all" ? "Semua" : selectedStatus}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {statusOptions.map(stat => (
              <DropdownMenuItem
                key={stat}
                onClick={() => setSelectedStatus(stat)}
              >
                {stat === 'all' ? 'Semua Status' : stat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <PromoTable
        promos={filteredPromos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Dialog */}
      <PromoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        promo={editingPromo}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        promo={promoToDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}
