import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
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

interface Career {
  id: number
  image: string | File
  description: string
}

interface CareerTableProps {
  careers: Career[]
  onEdit: (career: Career) => void
  onDelete: (career: Career) => void
  loading?: boolean
  error?: string | null
}

export function KarirTable({ careers, onEdit, onDelete, loading, error }: CareerTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Memuat data karir...</p>
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

  if (careers.length === 0) {
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
            <TableHead className='font-semibold'>Deskripsi Lowongan</TableHead>
            <TableHead className="font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {careers.map((career) => (
            <TableRow key={career.id}>
              <TableCell>
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  {career.image ? (
                    <Image
                      src={`${api_image_url}/karir/${career.image}`}
                      alt="Lowongan karir"
                      className="w-20 h-20 rounded-lg object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Eye className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-2xl">
                  <p className="text-gray-900 whitespace-pre-wrap">{career.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onEdit(career)}
                    className='bg-amber-500 text-white hover:bg-amber-600 hover:text-white'
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(career)}
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


