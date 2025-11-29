'use client'

import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { API_ENDPOINTS } from '@/app/api/api'
import { toast } from 'sonner'
import { DeleteDialog } from './components/DeleteDialog'
import { MembershipTable } from './components/MembershipTable'
import { MembershipDialog } from './components/MembershipDialog'
import { PointManagementDialog } from './components/PointManagementDialog'

interface Outlet {
  id: number
  location: string
  link: string
}

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
  total_points_redeemed: number 
}

export default function Membership() {
  const [members, setMembers] = useState<Membership[]>([])
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [membershipToDelete, setMembershipToDelete] = useState<Membership | null>(null)
  const [isPointDialogOpen, setIsPointDialogOpen] = useState(false)
  const [selectedMemberForPoints, setSelectedMemberForPoints] = useState<Membership | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const [managingPoints, setManagingPoints] = useState<boolean>(false)

  useEffect(() => {
    fetchMemberships()
    fetchOutlets()
  }, [])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.MEMBERSHIP)

      if (!response.ok) {
        throw new Error('Gagal mengambil data membership')
      }

      const data: { success: boolean; data: Membership[] } = await response.json()
      setMembers(data.data)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error('Gagal memuat data membership')
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
        toast.error('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchOutlets = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.OUTLET)

      if (!response.ok) {
        throw new Error('Gagal mengambil data outlet')
      }

      const data: { success: boolean; data: Outlet[] } = await response.json()
      setOutlets(data.data)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error('Gagal memuat data outlet')
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
        toast.error('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.member_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingMembership(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (member: Membership) => {
    setEditingMembership(member)
    setIsDialogOpen(true)
  }

  const handleDelete = (member: Membership) => {
    setMembershipToDelete(member)
    setIsDeleteDialogOpen(true)
  }

  const handleManagePoints = (member: Membership) => {
    setSelectedMemberForPoints(member)
    setIsPointDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Membership, 'id'>) => {
    try {
      setSaving(true)

      const payload = {
        name: formData.name,
        address: formData.address,
        no_wa: formData.no_wa,
        outlet_id: formData.outlet_id,
        points: formData.points || 0,
        total_points_earned: formData.total_points_earned || 0,
        total_points_redeemed: formData.total_points_redeemed || 0
      }

      let response: Response;

      if (editingMembership) {
        response = await fetch(API_ENDPOINTS.MEMBERSHIP_BY_ID(editingMembership.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(API_ENDPOINTS.MEMBERSHIP, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal menyimpan data membership')
      }

      const result = await response.json()

      if (result.success) {
        toast.success(editingMembership ? 'Member berhasil diupdate' : 'Member berhasil ditambahkan')
        await fetchMemberships()
        setIsDialogOpen(false)
        setEditingMembership(null)
      } else {
        throw new Error(result.error || 'Gagal menyimpan data membership')
      }

    } catch (err: unknown) {
      console.error('Error saving membership:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat menyimpan data')
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePointsUpdate = async (memberId: number, points: number, type: 'earn' | 'redeem') => {
    try {
      setManagingPoints(true)

      const endpoint = type === 'earn' 
        ? API_ENDPOINTS.ADD_POINTS(memberId)
        : API_ENDPOINTS.REDEEM_POINTS(memberId)

      const payload = {
        points: points,
        notes: type === 'earn' ? 'Points dari pembelian' : 'Points ditukar untuk diskon'
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Gagal ${type === 'earn' ? 'menambah' : 'menukar'} points`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        await fetchMemberships()
        setIsPointDialogOpen(false)
        setSelectedMemberForPoints(null)
      } else {
        throw new Error(result.error || `Gagal ${type === 'earn' ? 'menambah' : 'menukar'} points`)
      }

    } catch (err: unknown) {
      console.error('Error updating points:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat mengupdate points')
      }
    } finally {
      setManagingPoints(false)
    }
  }

  const confirmDelete = async () => {
    if (!membershipToDelete) return

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.MEMBERSHIP_BY_ID(membershipToDelete.id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal menghapus membership')
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Member berhasil dihapus')
        await fetchMemberships()
      } else {
        throw new Error(result.error || 'Gagal menghapus membership')
      }

    } catch (err: unknown) {
      console.error('Error deleting membership:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat menghapus membership')
      }
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setMembershipToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Membership</h1>
          <p className="text-gray-600 mt-1">Kelola data member dan points loyalty program</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Member
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">Total Members</div>
          <div className="text-2xl font-bold text-gray-900">{members.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">Total Points</div>
          <div className="text-2xl font-bold text-blue-600">
            {members.reduce((sum, member) => sum + member.points, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">Points Earned</div>
          <div className="text-2xl font-bold text-green-600">
            {members.reduce((sum, member) => sum + member.total_points_earned, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">Points Redeemed</div>
          <div className="text-2xl font-bold text-orange-600">
            {members.reduce((sum, member) => sum + member.total_points_redeemed, 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      <MembershipTable
        members={filteredMembers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManagePoints={handleManagePoints}
        loading={loading}
        error={error}
        userRole="admin"
      />

      {/* Add/Edit Dialog - KEY PROP DI SINI */}
      <MembershipDialog
        key={editingMembership ? `edit-${editingMembership.id}` : "new"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={editingMembership}
        onSave={handleSave}
        saving={saving}
        outlets={outlets}
      />

      {/* Point Management Dialog */}
      <PointManagementDialog
        open={isPointDialogOpen}
        onOpenChange={setIsPointDialogOpen}
        member={selectedMemberForPoints}
        onPointsUpdate={handlePointsUpdate}
        loading={managingPoints}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        member={membershipToDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}