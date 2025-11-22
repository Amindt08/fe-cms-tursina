'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
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
import Image from 'next/image'
import { API_ENDPOINTS } from '@/app/api/api'

interface Career {
  id: number
  image: string
  description: string
}

interface CareerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  career: Career | null
  onSave: (formData: Omit<Career, 'id'>) => void
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

  // useEffect(() => {
  //   const fetchCareers = async () => {
  //     try{
  //       setLoading(true)
  //       setError(null)

  //       const response = await fetch(API_ENDPOINTS.CAREER)

  //       if (!response.ok) {
  //         throw new Error('Gagal mengambil data karir')
  //       }

  //       const data: { success: boolean; data: Career[] } = await response.json()

  //       setCareers(data.data)

  //     } catch (err: unknown) {
  //       if (err instanceof Error) {
  //         setError(err.message)
  //       } else {
  //         setError("Terjadi kesalahan yang tidak diketahui")
  //       } 
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  // })

  // useEffect(() => {
  //   fetchCareers()
  // }, [])

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

  const confirmDelete = () => {
    if (careerToDelete) {
      setCareers(careers.filter(career => career.id !== careerToDelete.id))
    }
    setIsDeleteDialogOpen(false)
    setCareerToDelete(null)
  }

  const handleSave = (formData: Omit<Career, 'id'>) => {
    if (editingCareer) {
      // Update existing career
      setCareers(careers.map(career =>
        career.id === editingCareer.id ? { ...career, ...formData } : career
      ))
    } else {
      // Add new career
      const newCareer: Career = {
        id: Math.max(...careers.map(c => c.id)) + 1,
        ...formData
      }
      setCareers([...careers, newCareer])
    }
    setIsDialogOpen(false)
    setEditingCareer(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Karir</h1>
        </div>
        <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
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
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead>Deskripsi Lowongan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCareers.map((career) => (
              <TableRow key={career.id}>
                <TableCell>
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {career.image ? (
                      <Image
                        src={career.image}
                        alt="Lowongan karir"
                        className="w-20 h-20 rounded-lg object-cover"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <Eye className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-2xl">
                    <p className="text-gray-900 whitespace-pre-wrap">{career.description}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(career)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(career)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <CareerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        career={editingCareer}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Lowongan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus lowongan karir ini?
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
function CareerDialog({ open, onOpenChange, career, onSave }: CareerDialogProps) {
  const [formData, setFormData] = useState({
    image: career?.image || '',
    description: career?.description || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      image: '',
      description: ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{career ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}</DialogTitle>
          <DialogDescription>
            {career ? 'Ubah detail lowongan yang sudah ada' : 'Tambahkan lowongan baru ke dalam sistem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL Gambar</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Lowongan</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi lengkap tentang lowongan karir..."
              className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Jelaskan secara detail tentang posisi, kualifikasi, dan benefit yang ditawarkan
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {career ? 'Update Lowongan' : 'Tambah Lowongan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}