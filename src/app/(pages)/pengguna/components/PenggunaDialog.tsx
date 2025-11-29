import { useState } from 'react'
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
  Loader2
} from 'lucide-react'

interface Pengguna {
  id: number,
  name: string,
  email: string,
  role: string,
  status: 'active' | 'inactive'
}

interface PenggunaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pengguna: Pengguna | null
  onSave: (formData: Omit<Pengguna, 'id'>) => void
  saving?: boolean
}

export function PenggunaDialog({ open, onOpenChange, pengguna, onSave, saving = false }: PenggunaDialogProps) {
  const initialForm: Omit<Pengguna, "id"> = pengguna
    ? {
      name: pengguna.name,
      email: pengguna.email,
      role: pengguna.role,
      status: pengguna.status
    }
    : {
      name: '',
      email: '',
      role: '',
      status: 'active' // Default status active
    }

  const [formData, setFormData] = useState<Omit<Pengguna, "id">>(initialForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      alert('Harap lengkapi semua field yang diperlukan')
      return
    }

    onSave(formData)
  }

  const resetForm = () => {
    setFormData(initialForm)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        resetForm()
      }
      onOpenChange(open)
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{pengguna ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
          <DialogDescription>
            {pengguna 
              ? 'Ubah detail pengguna yang sudah ada' 
              : 'Tambahkan pengguna baru ke dalam sistem. Password default: 123'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama pengguna"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Masukkan email pengguna"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Superadmin">Superadmin</option>
              <option value="Membership">Membership</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {!pengguna && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Info:</strong> Password default untuk user baru adalah <strong>123</strong>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => onOpenChange(false)} 
              variant="outline"
              disabled={saving}
            >
              Batal
            </Button>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={saving}
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {pengguna ? 'Update Pengguna' : 'Tambah Pengguna'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}