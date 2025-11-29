// components/PointManagementDialog.tsx
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
import { Label } from '@radix-ui/react-label'
import { Plus, Minus, Loader2, Coins } from 'lucide-react'

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

interface PointManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Membership | null
  onPointsUpdate: (memberId: number, points: number, type: 'earn' | 'redeem') => void
  loading?: boolean
}

export function PointManagementDialog({ 
  open, 
  onOpenChange, 
  member, 
  onPointsUpdate, 
  loading = false 
}: PointManagementDialogProps) {
  const [points, setPoints] = useState(0)
  const [type, setType] = useState<'earn' | 'redeem'>('earn')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (points > 0 && member) {
      onPointsUpdate(member.id, points, type)
      setPoints(0)
    }
  }

  // const maxRedeem = type === 'redeem' ? member?.points : undefined

  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            Kelola Points Member
          </DialogTitle>
          <DialogDescription>
            {member.name} - {member.member_code}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-blue-50 rounded-lg mb-4 border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">Points Saat Ini</p>
            <p className="text-2xl font-bold text-blue-600">{member.points} pts</p>
            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
              <span>Earned: {member.total_points_earned}</span>
              <span>Redeemed: {member.total_points_redeemed}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipe Transaksi</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'earn' ? "default" : "outline"}
                onClick={() => {
                  setType('earn')
                  setPoints(0)
                }}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Points
              </Button>
              <Button
                type="button"
                variant={type === 'redeem' ? "default" : "outline"}
                onClick={() => {
                  setType('redeem')
                  setPoints(0)
                }}
                className="flex-1"
                disabled={member.points === 0}
              >
                <Minus className="h-4 w-4 mr-2" />
                Tukar Points
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Jumlah Points {type === 'earn' ? 'yang Ditambahkan' : 'yang Ditukar'}
            </Label>
            <Input
              type="number"
              value={points || ''}
              onChange={(e) => setPoints(Number(e.target.value))}
              placeholder={`Masukkan jumlah points`}
              min="1"
              max={type === 'redeem' ? member.points : undefined}
              required
            />
            {type === 'redeem' && (
              <p className="text-sm text-gray-500">
                Maksimal: {member.points} points
              </p>
            )}
          </div>

          {points > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm text-gray-600">
                {type === 'earn' ? 'Points setelah ditambah:' : 'Points setelah ditukar:'}
              </div>
              <div className="text-lg font-semibold">
                {type === 'earn' 
                  ? `${member.points + points} points`
                  : `${member.points - points} points`
                }
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false)
                setPoints(0)
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className={type === 'earn' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}
              disabled={loading || points <= 0 || (type === 'redeem' && points > (member?.points || 0))}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {type === 'earn' ? 'Tambah Points' : 'Tukar Points'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}