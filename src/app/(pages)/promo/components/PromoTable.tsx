import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import { api_image_url } from '@/app/api/api'

interface Promo {
  id: number
  promo_name: string
  image: string | File
  status: 'active' | 'inactive'
}

interface PromoTableProps {
  promos: Promo[]
  onEdit: (promo: Promo) => void
  onDelete: (promo: Promo) => void
  loading?: boolean
  error?: string | null
}

export function PromoTable({ promos, onEdit, onDelete, loading, error }: PromoTableProps) {

  function getSafeImageUrl(image: string | File) {
    if (image instanceof File) return URL.createObjectURL(image)
    if (typeof image === "string") return `${api_image_url}/promo/${image}`
    return "/no-image.png"
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Memuat data promo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (promos.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Tidak ada data promo ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-semibold'>Gambar</TableHead>
            <TableHead className='font-semibold'>Nama Promo</TableHead>
            <TableHead className='font-semibold'>Status</TableHead>
            <TableHead className="font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {promos.map((promo) => (
            <TableRow key={promo.id}>

              {/* Gambar */}
              <TableCell>
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {promo.image ? (
                    <Image
                      src={getSafeImageUrl(promo.image)}
                      alt={promo.promo_name}
                      className="w-12 h-12 object-cover rounded-lg"
                      width={40}
                      height={40}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <Eye className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </TableCell>

              {/* Nama Promo */}
              <TableCell className="font-medium">{promo.promo_name}</TableCell>

              {/* Status */}
              <TableCell>
                <Badge className={promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {promo.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </TableCell>

              {/* Aksi */}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onEdit(promo)}
                    className='bg-amber-500 text-white hover:bg-amber-600 hover:text-white'
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(promo)}
                    className='bg-red-500 text-white hover:bg-red-600 hover:text-white'
                  >
                    <Trash2 className="h-4w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
