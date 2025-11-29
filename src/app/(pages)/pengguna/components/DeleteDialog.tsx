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

interface Pengguna {
  id: number,
  name: string,
  email: string,
  // password: string,
  role: string,
  status: string
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pengguna: Pengguna | null
  onConfirm: () => void
  loading?: boolean
}

export function DeleteDialog({ open, onOpenChange, pengguna, onConfirm, loading = false }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Menu</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus menu <strong>{pengguna?.name}</strong>?
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