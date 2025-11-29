import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

interface Outlet {
  id: number
  location: string
  link: string
}

interface Membership {
  id: number,
  member_code: string,
  name: string,
  address: string,
  no_wa: string,
  outlet: string,
  outlet_id: number,
  points: number,
  total_points_earned: number,
  total_points_redeemed: number
}

interface MembershipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Membership | null
  onSave: (formData: Omit<Membership, 'id'>) => void
  saving?: boolean
  outlets: Outlet[]
}

export function MembershipDialog({ 
  open, 
  onOpenChange, 
  member, 
  onSave, 
  saving = false,
  outlets 
}: MembershipDialogProps) {
  // Fungsi untuk mendapatkan initial form data
  const getInitialForm = (): Omit<Membership, "id"> => {
    if (member) {
      return {
        member_code: member.member_code,
        name: member.name,
        address: member.address,
        no_wa: member.no_wa,
        outlet: member.outlet,
        outlet_id: member.outlet_id,
        points: member.points,
        total_points_earned: member.total_points_earned,
        total_points_redeemed: member.total_points_redeemed
      }
    }
    return {
      member_code: '',
      name: '',
      address: '',
      no_wa: '',
      outlet: '',
      outlet_id: 0,
      points: 0,
      total_points_earned: 0,
      total_points_redeemed: 0
    }
  }

  // State akan direset otomatis ketika key prop berubah
  const [formData, setFormData] = useState<Omit<Membership, "id">>(getInitialForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || 
        !formData.address.trim() || 
        !formData.no_wa.trim() || 
        !formData.outlet_id) {
      alert('Harap lengkapi semua field yang diperlukan')
      return
    }

    onSave(formData)
  }

  const handleOutletChange = (value: string) => {
    const outletId = parseInt(value)
    const selectedOutlet = outlets.find(outlet => outlet.id === outletId)
    
    setFormData({ 
      ...formData, 
      outlet_id: outletId,
      outlet: selectedOutlet?.location || ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Tambah Member Baru'}</DialogTitle>
          <DialogDescription>
            {member ? 'Ubah detail member yang sudah ada' : 'Tambahkan member baru ke dalam sistem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-[450px]">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nama Member</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama member"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Alamat</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Masukkan alamat"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">No. WhatsApp Aktif</Label>
            <Input
              value={formData.no_wa}
              onChange={(e) => setFormData({ ...formData, no_wa: e.target.value })}
              placeholder="Masukkan no. wa"
              required
            />
          </div>

       <div className="space-y-2">
  <Label className="text-sm font-medium truncate block">Outlet</Label>
  <Select 
    value={formData.outlet_id === 0 ? "" : formData.outlet_id.toString()} 
    onValueChange={handleOutletChange}
    required
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Pilih lokasi outlet" />
    </SelectTrigger>
    <SelectContent className="max-w-[300px]">
      {outlets.map((outlet) => (
        <SelectItem 
          key={outlet.id} 
          value={outlet.id.toString()}
          className="truncate max-w-[280px]"
        >
          <span className="truncate block" title={outlet.location}>
            {outlet.location}
          </span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

          {/* Menampilkan points hanya untuk edit mode */}
          {member && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Informasi Points</Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Points Saat Ini</p>
                  <p className="font-semibold text-lg text-blue-600">{formData.points} pts</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Points Didapat</p>
                  <p className="font-semibold text-green-600">{formData.total_points_earned} pts</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Points Ditukar</p>
                  <p className="font-semibold text-orange-600">{formData.total_points_redeemed} pts</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={saving}
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {member ? 'Update Member' : 'Tambah Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}