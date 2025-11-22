'use client'

import { useState } from 'react'
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

// Type definitions
interface Gallery {
  id: number
  category: string
  image: string
  description: string
}

interface GalleryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gallery: Gallery | null
  onSave: (formData: Omit<Gallery, 'id'>) => void
}

// Mock data
const galleryData: Gallery[] = [
  {
    id: 1,
    category: "Makanan",
    image: "/images/gallery-food-1.jpg",
    description: "Kebab Regular dengan saus spesial Tursina"
  },
  {
    id: 2,
    category: "Makanan",
    image: "/images/gallery-food-2.jpg",
    description: "Kebab Jumbo dengan extra keju dan daging"
  },
  {
    id: 3,
    category: "Outlet",
    image: "/images/gallery-outlet-1.jpg",
    description: "Interior modern outlet Tursina Kebab Margonda"
  },
  {
    id: 4,
    category: "Acara",
    image: "/images/gallery-event-1.jpg",
    description: "Grand opening cabang baru Tursina Kebab"
  },
  {
    id: 5,
    category: "Tim",
    image: "/images/gallery-team-1.jpg",
    description: "Tim profesional Tursina Kebab siap melayani"
  }
]

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>(galleryData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null)

  // Filter galleries based on search and category
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

  const confirmDelete = () => {
    if (galleryToDelete) {
      setGalleries(galleries.filter(gallery => gallery.id !== galleryToDelete.id))
    }
    setIsDeleteDialogOpen(false)
    setGalleryToDelete(null)
  }

  const handleSave = (formData: Omit<Gallery, 'id'>) => {
    if (editingGallery) {
      // Update existing gallery
      setGalleries(galleries.map(gallery =>
        gallery.id === editingGallery.id ? { ...gallery, ...formData } : gallery
      ))
    } else {
      // Add new gallery
      const newGallery: Gallery = {
        id: Math.max(...galleries.map(g => g.id)) + 1,
        ...formData
      }
      setGalleries([...galleries, newGallery])
    }
    setIsDialogOpen(false)
    setEditingGallery(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Galeri</h1>
        </div>
        <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
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
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGalleries.map((gallery) => (
              <TableRow key={gallery.id}>
                <TableCell>
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {gallery.image ? (
                      <Image
                        src={gallery.image}
                        alt={gallery.description}
                        className="w-20 h-20 object-cover"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <Eye className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {gallery.category}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-gray-900 line-clamp-2">{gallery.description}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(gallery)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(gallery)}
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
      <GalleryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        gallery={editingGallery}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Foto</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus foto {galleryToDelete?.description}?
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
function GalleryDialog({ open, onOpenChange, gallery, onSave }: GalleryDialogProps) {
  const [formData, setFormData] = useState({
    category: gallery?.category || '',
    image: gallery?.image || '',
    description: gallery?.description || ''
  })

  const categories = ['Makanan', 'Outlet', 'Acara', 'Tim', 'Lainnya']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      category: '',
      image: '',
      description: ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{gallery ? 'Edit Foto' : 'Tambah Foto Baru'}</DialogTitle>
          <DialogDescription>
            {gallery ? 'Ubah detail foto yang sudah ada' : 'Tambahkan foto baru ke galeri'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL Gambar</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          </div>

          {formData.image && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview Gambar</label>
              <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={formData.image}
                  alt="Preview"
                  className="w-40 h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  width={40}
                  height={40}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Foto</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi foto..."
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Jelaskan secara singkat tentang foto yang diupload
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {gallery ? 'Update Foto' : 'Tambah Foto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}