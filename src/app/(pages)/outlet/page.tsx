'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, MapPin, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { API_ENDPOINTS } from '@/app/api/api'

// Type definitions
interface Outlet {
  id: number
  location: string
  link: string
}

interface OutletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  outlet: Outlet | null
  onSave: (formData: Omit<Outlet, 'id'>) => void
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

  // Fetch data dari backend
  const fetchOutlets = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.OUTLET)

      if (!response.ok) {
        throw new Error('Gagal mengambil data outlet')
      }

      const data = await response.json()

      // Validasi response structure
      if (data.success && Array.isArray(data.data)) {
        setOutlets(data.data)
      } else {
        throw new Error('Format data tidak valid')
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOutlets()
  }, [])

  // Create outlet baru
  const createOutlet = async (formData: Omit<Outlet, 'id'>) => {
    try {
      const response = await fetch(API_ENDPOINTS.OUTLET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        await fetchOutlets() // Refresh data
        return true
      } else {
        throw new Error(data.message || 'Gagal membuat outlet')
      }
    } catch (error) {
      console.error('Create outlet error:', error)
      return false
    }
  }

  // Update outlet
  const updateOutlet = async (id: number, formData: Omit<Outlet, 'id'>) => {
    try {
      const response = await fetch(API_ENDPOINTS.OUTLET_BY_ID(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        await fetchOutlets() // Refresh data
        return true
      } else {
        throw new Error(data.message || 'Gagal update outlet')
      }
    } catch (error) {
      console.error('Update outlet error:', error)
      return false
    }
  }

  // Delete outlet
  const deleteOutlet = async (id: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.OUTLET_BY_ID(id), {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchOutlets() // Refresh data
        return true
      } else {
        throw new Error(data.message || 'Gagal menghapus outlet')
      }
    } catch (error) {
      console.error('Delete outlet error:', error)
      return false
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data outlet...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 hover:bg-red-700"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    )
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

  const confirmDelete = async () => {
    if (outletToDelete) {
      const success = await deleteOutlet(outletToDelete.id)
      if (!success) {
        setError('Gagal menghapus outlet')
      }
    }
    setIsDeleteDialogOpen(false)
    setOutletToDelete(null)
  }

  const handleSave = async (formData: Omit<Outlet, 'id'>) => {
    let success = false

    if (editingOutlet) {
      // Update existing outlet
      success = await updateOutlet(editingOutlet.id, formData)
    } else {
      // Add new outlet
      success = await createOutlet(formData)
    }

    if (success) {
      setIsDialogOpen(false)
      setEditingOutlet(null)
    } else {
      setError(editingOutlet ? 'Gagal update outlet' : 'Gagal membuat outlet')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Outlet</h1>
        </div>
        <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
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
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lokasi Outlet</TableHead>
              <TableHead>Link Maps</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOutlets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  {outlets.length === 0 ? 'Tidak ada data outlet' : 'Tidak ada outlet yang sesuai dengan pencarian'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOutlets.map((outlet) => (
                <TableRow key={outlet.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">{outlet.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={outlet.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Buka di Google Maps
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(outlet)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(outlet)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <OutletDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        outlet={editingOutlet}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Outlet</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus outlet {outletToDelete?.location}?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dialog Component for Add/Edit
function OutletDialog({ open, onOpenChange, outlet, onSave }: OutletDialogProps) {
  const [formData, setFormData] = useState({
    location: outlet?.location || '',
    link: outlet?.link || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    // Reset form hanya jika bukan edit mode
    if (!outlet) {
      setFormData({
        location: '',
        link: ''
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{outlet ? 'Edit Outlet' : 'Tambah Outlet Baru'}</DialogTitle>
          <DialogDescription>
            {outlet ? 'Ubah detail outlet yang sudah ada' : 'Tambahkan outlet baru ke dalam sistem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lokasi Outlet</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Contoh: Tursina Kebab Cabang Margonda"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link Google Maps</label>
            <Input
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://maps.google.com/maps?q=..."
              required
            />
            <p className="text-xs text-gray-500">
              Masukkan link Google Maps lengkap untuk lokasi outlet
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {outlet ? 'Update Outlet' : 'Tambah Outlet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}