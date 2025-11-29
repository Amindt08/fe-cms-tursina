import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import Image from 'next/image'

interface Menu {
  id: number
  menu_name: string
  image: string | File
  details: string
  price: number
  category: string
  status: 'active' | 'inactive'
}

interface MenuDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menu: Menu | null
  onSave: (formData: Omit<Menu, 'id'>) => void
  saving?: boolean
}

export function MenuDialog({ open, onOpenChange, menu, onSave, saving = false }: MenuDialogProps) {
  const initialForm: Omit<Menu, "id"> = menu
    ? {
      menu_name: menu.menu_name,
      image: menu.image,
      details: menu.details,
      price: menu.price,
      category: menu.category,
      status: menu.status,
    }
    : {
      menu_name: '',
      image: '',
      details: '',
      price: 0,
      category: '',
      status: 'active'
    }

  const [formData, setFormData] = useState<Omit<Menu, "id">>(initialForm)
  const [previewImage, setPreviewImage] = useState<string | null>(
    typeof menu?.image === "string"
      ? `${api_image_url}/menu/${menu.image}`
      : null
  )
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

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

    if (!formData.menu_name.trim() || !formData.details.trim() || !formData.category.trim() || formData.price <= 0) {
      alert('Harap lengkapi semua field yang diperlukan')
      return
    }

    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key={menu ? menu.id : "new"}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{menu ? 'Edit Menu' : 'Tambah Menu Baru'}</DialogTitle>
          <DialogDescription>
            {menu ? 'Ubah detail menu yang sudah ada' : 'Tambahkan menu baru ke dalam sistem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div className="space-y-3">
            <Label htmlFor="image">Gambar Menu</Label>

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
                    <Image src={previewImage} alt='Gambar Menu' className="w-full h-full object-cover" width={40} height={40}/>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  {formData.image instanceof File ? formData.image.name : formData.image}
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Menu *</Label>
              <Input
                value={formData.menu_name}
                onChange={(e) => setFormData({ ...formData, menu_name: e.target.value })}
                placeholder='Masukkan nama menu'
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Harga *</Label>
              <Input
                type="text"
                inputMode="numeric"
                value={formData.price === 0 ? '' : `Rp ${formData.price.toLocaleString('id-ID')}`}
                onChange={(e) => {
                  // Hapus semua karakter non-digit
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setFormData({
                    ...formData,
                    price: numericValue === '' ? 0 : parseInt(numericValue)
                  });
                }}
                placeholder='Masukkan harga'
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Detail Menu *</Label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full min-h-[100px] p-3 border rounded-lg"
              placeholder='Masukkan detail menu'
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Pilih kategori</option>
                <option value="Paket Bundling">Paket Bundling</option>
                <option value="Unggulan">Unggulan</option>
                <option value="Kebab">Kebab</option>
                <option value="Burger">Burger</option>
                <option value="Maryam">Maryam</option>
                <option value="Minuman">Minuman</option>
                <option value="Topping">Topping</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
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
              {menu ? 'Update Menu' : 'Tambah Menu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>///
  )
}
