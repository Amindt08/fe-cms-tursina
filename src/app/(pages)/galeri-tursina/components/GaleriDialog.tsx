import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Upload,
  X,
  Loader2
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { api_image_url } from '@/app/api/api'

interface Gallery {
  id: number
  category: string
  image: string | File
  description: string
}

interface GalleryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gallery: Gallery | null
  onSave: (formData: Omit<Gallery, 'id'>) => void
  saving?: boolean
}

export function GaleriDialog({ open, onOpenChange, gallery, onSave, saving = false }: GalleryDialogProps) {
  const initialForm: Omit<Gallery, "id"> = gallery
    ? {
      category: gallery.category,
      image: gallery.image,
      description: gallery.description,
    }
    : {
      category: '',
      image: '',
      description: '',
    }

  const [formData, setFormData] = useState<Omit<Gallery, "id">>(initialForm)
  const [previewImage, setPreviewImage] = useState<string | null>(
    typeof gallery?.image === "string"
      ? `${api_image_url}/gallery/${gallery.image}`
      : null
    )
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = ['Galeri Tim', 'Galeri Customer']

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file harus kurang dari 5MB')
      return
    }

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setPreviewImage(imageUrl)
      setFormData(prev => ({ ...prev, image: file }))
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) handleFileSelect(files[0])
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleFileSelect(files[0])
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setFormData(prev => ({ ...prev, image: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category.trim() || !formData.description.trim()) {
      alert('Harap lengkapi semua field yang diperlukan')
      return
    }

    onSave(formData)
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

          <div className="space-y-3">
            <Label htmlFor="image">Gambar</Label>

            {!previewImage && (
              <div
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                  ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                    <p className="text-sm text-gray-600">Mengupload gambar...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm">Klik untuk upload atau drag & drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                    <Badge variant="secondary">Pilih File</Badge>
                  </div>
                )}
              </div>
            )}

            {previewImage && (
              <div className="relative border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Preview Gambar</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border">
                    <img src={previewImage} className="w-full h-full object-cover" />
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  {formData.image instanceof File ? formData.image.name : formData.image}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi foto..."
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)} className='bg-gray-600 hover:bg-gray-700 text-white hover:text-white'>
              Batal
            </Button>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={saving || isUploading}
            >
              {(saving || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {gallery ? 'Update Galeri' : 'Tambah Galeri'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

