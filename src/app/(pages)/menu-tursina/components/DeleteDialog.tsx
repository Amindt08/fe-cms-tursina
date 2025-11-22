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

interface Menu {
  id: number
  menu_name: string
  image: string
  details: string
  price: number
  category: string
  status: 'active' | 'inactive'
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menu: Menu | null
  onConfirm: () => void
  loading?: boolean
}

export function DeleteDialog({ open, onOpenChange, menu, onConfirm, loading = false }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Menu</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus menu <strong>{menu?.menu_name}</strong>?
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