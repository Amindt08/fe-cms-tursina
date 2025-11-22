import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'

interface Promo {
  id: number
  promo_name: string
  image: string | File
  status: 'active' | 'inactive'
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promo: Promo | null
  onConfirm: () => void
  loading?: boolean
}


export function DeleteDialog({ open, onOpenChange, promo, onConfirm, loading = false }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Promo</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus promo <strong>{promo?.promo_name}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}