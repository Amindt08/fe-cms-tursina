import { useState } from 'react'
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
import {
  Loader2
} from 'lucide-react'
import { Label } from '@radix-ui/react-label'
import { Switch } from '@/components/ui/switch'

interface Outlet {
  id: number
  location: string
  link: string
  is_active: boolean
}

interface OutletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  outlet: Outlet | null
  onSave: (formData: Omit<Outlet, 'id'>) => void
  saving?: boolean
}

export function OutletDialog({ open, onOpenChange, outlet, onSave, saving = false }: OutletDialogProps) {
  const initialForm: Omit<Outlet, "id"> = outlet
    ? {
      location: outlet.location,
      link: outlet.link,
      is_active: outlet.is_active
    }
    : {
      location: '',
      link: '',
      is_active: true
    }

  const [formData, setFormData] = useState<Omit<Outlet, "id">>(initialForm)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.location.trim() || !formData.link.trim()) {
      alert('Harap lengkapi semua field yang diperlukan')
      return
    }

    onSave(formData)
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
              placeholder="Masukkan lokasi outlet"
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

          <div className="space-y-2">
            <Label htmlFor="is_active">Status Aktif</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">
                {formData.is_active ? 'Aktif' : 'Tidak Aktif'}
              </Label>
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
              {outlet ? 'Update Outlet' : 'Tambah Outlet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

