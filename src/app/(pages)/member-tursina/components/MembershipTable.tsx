// components/MembershipTable.tsx (update)
import { Edit, Trash2, Star, Coins } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/auth-context'

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
  total_points_redeemed: number,
  is_active: boolean
}

interface MembershipTableProps {
  members: Membership[]
  onEdit: (member: Membership) => void
  onDelete: (member: Membership) => void
  onManagePoints: (member: Membership) => void
  loading?: boolean
  error?: string | null
  userRole?: string
}

export function MembershipTable({
  members,
  onEdit,
  onDelete,
  onManagePoints,
  loading,
  error,
  // userRole = 'user'
}: MembershipTableProps) {
  const { user } = useAuth()
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin'
  }
  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Memuat data member...</p>
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

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
        <p>Tidak ada data member yang ditemukan.</p>
      </div>
    )
  }

  const getPointsBadgeClass = (points: number) => {
    if (points >= 1000)
      return "bg-green-500 hover:bg-green-600 text-white border-green-600"
    if (points >= 500)
      return "bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
    if (points >= 100)
      return "bg-red-500 hover:bg-red-600 text-white border-red-600"
    return "bg-red-500 hover:bg-red-600 text-white border-red-600"
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-semibold'>Kode Member</TableHead>
            <TableHead className='font-semibold'>Nama Member</TableHead>
            <TableHead className='font-semibold'>Alamat</TableHead>
            <TableHead className='font-semibold'>No WhatsApp</TableHead>
            <TableHead className='font-semibold w-[150px]'>Outlet</TableHead>
            <TableHead className='font-semibold text-center'>Points</TableHead>
            <TableHead className='font-semibold text-center'>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.member_code}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.address}</TableCell>
              <TableCell>{member.no_wa}</TableCell>
              <TableCell className="max-w-[150px]">
                <div className="truncate" title={member.outlet}>
                  {member.outlet}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`flex items-center gap-1 w-fit mx-auto border ${getPointsBadgeClass(member.points)}`}
                >
                  <Star className="h-3 w-3 fill-current" />
                  {member.points} pts
                </Badge>
                <div className="text-xs text-gray-500 mt-1">
                  Earned: {member.total_points_earned} | Redeemed: {member.total_points_redeemed}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  {/* Tombol Kelola Points - bisa diakses semua user */}
                  <Button
                    size="sm"
                    onClick={() => onManagePoints(member)}
                    className='bg-green-600 text-white hover:bg-green-700 hover:text-white'
                    title="Kelola Points"
                  >
                    <Coins className="h-4 w-4" />
                  </Button>

                  {/* Tombol Edit - hanya untuk admin dan superadmin */}
                  {isAdmin() && (
                    <Button
                      size="sm"
                      onClick={() => onEdit(member)}
                      className='bg-amber-500 text-white hover:bg-amber-600 hover:text-white'
                      title="Edit Member"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Tombol Hapus - hanya untuk admin dan superadmin */}
                  {isAdmin() && (
                    <Button
                      size="sm"
                      onClick={() => onDelete(member)}
                      className='bg-red-500 text-white hover:bg-red-600 hover:text-white'
                      title="Hapus Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Tampilkan pesan jika bukan admin dan ingin akses edit/hapus */}
                  {/* {!isAdmin() && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 px-2">
                      Hanya Admin
                    </div>
                  )} */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}