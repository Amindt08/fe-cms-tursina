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

interface Gallery {
  id: number
  category: string
  image: string | File
  description: string
}

interface GalleryTableProps {
  galleries: Gallery[]
  onEdit: (gallery: Gallery) => void
  onDelete: (gallery: Gallery) => void
  loading?: boolean
  error?: string | null
}

export function GaleriTable({ galleries, onEdit, onDelete, loading, error }: GalleryTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Memuat data menu...</p>
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

  if (galleries.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Tidak ada data menu yang ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-semibold'>Gambar</TableHead>
            <TableHead className='font-semibold'>Kategori</TableHead>
            <TableHead className='font-semibold'>Deskripsi</TableHead>
            <TableHead className='font-semibold'>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galleries.map((gallery) => (
            <TableRow key={gallery.id}>
              <TableCell>
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {gallery.image ? (
                    <Image
                      src={`${api_image_url}/gallery/${gallery.image}`}
                      alt={gallery.description}
                      className="w-20 h-20 object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Eye className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {gallery.category}
                </Badge>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-gray-900 line-clamp-2">{gallery.description}</p>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onEdit(gallery)}
                    className='bg-amber-500 text-white hover:bg-amber-600 hover:text-white'
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(gallery)}
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

