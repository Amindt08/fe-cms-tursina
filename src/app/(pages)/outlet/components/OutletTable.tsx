import { Edit, Trash2, MapPin, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Outlet {
  id: number
  location: string
  link: string
}

interface OutletTableProps {
  outlets: Outlet[]
  onEdit: (outlet: Outlet) => void
  onDelete: (outlet: Outlet) => void
  loading?: boolean
  error?: string | null
}

export function OutletTable({ outlets, onEdit, onDelete, loading, error }: OutletTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Memuat data outlet...</p>
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

  if (outlets.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Tidak ada data outlet yang ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-semibold'>Lokasi Outlet</TableHead>
            <TableHead className='font-semibold'>Link Maps</TableHead>
            <TableHead className="font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outlets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                {outlets.length === 0 ? 'Tidak ada data outlet' : 'Tidak ada outlet yang sesuai dengan pencarian'}
              </TableCell>
            </TableRow>
          ) : (
            outlets.map((outlet) => (
              <TableRow key={outlet.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">{outlet.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={outlet.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Buka di Google Maps
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit(outlet)}
                      className='bg-amber-500 text-white hover:bg-amber-600 hover:text-white'
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDelete(outlet)}
                      className='bg-red-500 text-white hover:bg-red-600 hover:text-white'
                    >
                      <Trash2 className="h-4w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default OutletTable
