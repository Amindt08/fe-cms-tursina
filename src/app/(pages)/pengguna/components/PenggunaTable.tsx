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

interface Pengguna {
  id: number,
  name: string,
  email: string,
  // password: string,
  role: string,
  status: 'active' | 'inactive'
}

interface PenggunaTableProps {
  users: Pengguna[]
  onEdit: (pengguna: Pengguna) => void
  onDelete: (pengguna: Pengguna) => void
  loading?: boolean
  error?: string | null
}

export function PenggunaTable({ users, onEdit, onDelete, loading, error }: PenggunaTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Memuat data pengguna...</p>
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

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Tidak ada data pengguna yang ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-semibold'>Nama</TableHead>
            <TableHead className='font-semibold'>Email</TableHead>
            <TableHead className='font-semibold'>Role</TableHead>
            <TableHead className='font-semibold'>Status</TableHead>
            <TableHead className='font-semibold'>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((pengguna) => (
            <TableRow key={pengguna.id}>
              <TableCell className="font-medium">{pengguna.name}</TableCell>
              <TableCell className="max-w-xs truncate">{pengguna.email}</TableCell>
              <TableCell>{pengguna.role}</TableCell>
              <TableCell>
                <Badge className={pengguna.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {pengguna.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onDelete(pengguna)}
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


