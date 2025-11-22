'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { API_ENDPOINTS, api_image_url } from '@/app/api/api'

// Type definitions
interface Promo {
  id: number
  promo_name: string
  image: string
  status: 'active' | 'inactive'
}

interface PromoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promo: Promo | null
  onSave: (formData: Omit<Promo, 'id'>) => void
}

// Utility function untuk URL gambar yang aman
const getSafeImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/')) {
    return `${api_image_url}${imagePath}`;
  }

  return `${api_image_url}/${imagePath}`;
}

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState<Promo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(API_ENDPOINTS.PROMO)

        if (!response.ok) {
          throw new Error('Gagal mengambil data promo')
        }

        const data = await response.json()

        // Validasi response structure
        if (data.success && Array.isArray(data.data)) {
          setPromos(data.data)
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

    fetchPromo()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data promo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    )
  }

  const filteredPromos = promos.filter(promo => {
    const matchesSearch = promo.promo_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || promo.status === selectedStatus
    return matchesSearch && matchesStatus
  })

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

  const confirmDelete = () => {
    if (promoToDelete) {
      setPromos(promos.filter(promo => promo.id !== promoToDelete.id))
    }
    setIsDeleteDialogOpen(false)
    setPromoToDelete(null)
  }

  const handleSave = (formData: Omit<Promo, 'id'>) => {
    if (editingPromo) {
      // Update existing promo
      setPromos(promos.map(promo =>
        promo.id === editingPromo.id ? { ...promo, ...formData } : promo
      ))
    } else {
      // Add new promo
      const newPromo: Promo = {
        id: Math.max(0, ...promos.map(p => p.id)) + 1,
        ...formData
      }
      setPromos([...promos, newPromo])
    }
    setIsDialogOpen(false)
    setEditingPromo(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Promo</h1>
        </div>
        <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Promo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Status: {selectedStatus === 'all' ? 'Semua' : selectedStatus === 'active' ? 'Aktif' : 'Nonaktif'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
              Semua Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedStatus('active')}>
              Aktif
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedStatus('inactive')}>
              Nonaktif
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama Promo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {promos.length === 0 ? 'Tidak ada data promo' : 'Tidak ada promo yang sesuai dengan filter'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPromos.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {promo.image ? (
                        <Image
                          src={getSafeImageUrl(promo.image)}
                          alt={promo.promo_name}
                          className="w-16 h-16 object-cover"
                          width={64}
                          height={64}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {/* Fallback icon */}
                      <div className={`w-16 h-16 flex items-center justify-center ${promo.image ? 'absolute' : ''}`}>
                        <Eye className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{promo.promo_name}</TableCell>
                  <TableCell>
                    <Badge className={promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {promo.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(promo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(promo)}
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
      <PromoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        promo={editingPromo}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Promo</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus promo {promoToDelete?.promo_name}?
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
function PromoDialog({ open, onOpenChange, promo, onSave }: PromoDialogProps) {
  const [formData, setFormData] = useState({
    promo_name: promo?.promo_name || '',
    image: promo?.image || '',
    status: promo?.status || 'active' as 'active' | 'inactive'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    // Reset form hanya jika bukan edit mode
    if (!promo) {
      setFormData({
        promo_name: '',
        image: '',
        status: 'active'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{promo ? 'Edit Promo' : 'Tambah Promo Baru'}</DialogTitle>
          <DialogDescription>
            {promo ? 'Ubah detail promo yang sudah ada' : 'Tambahkan promo baru ke dalam sistem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Promo</label>
            <Input
              value={formData.promo_name}
              onChange={(e) => setFormData({ ...formData, promo_name: e.target.value })}
              placeholder="Masukkan nama promo"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL Gambar</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/images/promo/nama-file.jpg"
            />
            <p className="text-xs text-gray-500">
              Masukkan path gambar relatif dari folder public
            </p>
            {formData.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={getSafeImageUrl(formData.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {promo ? 'Update Promo' : 'Tambah Promo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}