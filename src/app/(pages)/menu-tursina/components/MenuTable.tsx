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

interface Menu {
  id: number
  menu_name: string
  image: string | File
  details: string
  price: number
  category: string
  status: 'active' | 'inactive'
}

interface MenuTableProps {
  menus: Menu[]
  onEdit: (menu: Menu) => void
  onDelete: (menu: Menu) => void
  loading?: boolean
  error?: string | null
}

export function MenuTable({ menus, onEdit, onDelete, loading, error }: MenuTableProps) {
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

  if (menus.length === 0) {
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
            <TableHead className='font-semibold'>Nama Menu</TableHead>
            <TableHead className='font-semibold'>Detail</TableHead>
            <TableHead className='font-semibold'>Harga</TableHead>
            <TableHead className='font-semibold'>Kategori</TableHead>
            <TableHead className='font-semibold'>Status</TableHead>
            <TableHead className='font-semibold'>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus.map((menu) => (
            <TableRow key={menu.id}>
              <TableCell>
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {menu.image ? (
                    <Image
                      src={`${api_image_url}/menu/${menu.image}`}
                      alt={menu.menu_name}
                      className="w-12 h-12 rounded-lg object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Eye className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{menu.menu_name}</TableCell>
              <TableCell className="max-w-xs truncate">{menu.details}</TableCell>
              <TableCell>Rp {menu.price.toLocaleString('id-ID')}</TableCell>
              <TableCell>{menu.category}</TableCell>
              <TableCell>
                <Badge className={menu.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {menu.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onEdit(menu)}
                    className='bg-amber-500 text-white hover:bg-amber-600 hover:text-white'
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(menu)}
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