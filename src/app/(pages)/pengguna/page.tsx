'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { API_ENDPOINTS } from '@/app/api/api'
import { toast } from 'sonner'
import { PenggunaTable } from './components/PenggunaTable'
import { PenggunaDialog } from './components/PenggunaDialog'
import { DeleteDialog } from './components/DeleteDialog'

interface Pengguna {
  id: number,
  name: string,
  email: string,
  // password: string,
  role: string,
  status: 'active' | 'inactive'
}

export default function Pengguna() {
  const [pengguna, setPengguna] = useState<Pengguna[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPengguna, setEditingPengguna] = useState<Pengguna | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [penggunaToDelete, setPenggunaToDelete] = useState<Pengguna | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => {
    fetchPengguna()
  }, [])

  const fetchPengguna = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.USERS)

      if (!response.ok) {
        throw new Error('Gagal mengambil data pengguna')
      }

      const data: { success: boolean; data: Pengguna[] } = await response.json()
      setPengguna(data.data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error('Gagal memuat data pengguna')
      } else {
        setError("Terjadi kesalahan yang tidak diketahui")
        toast.error('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredPengguna = pengguna.filter(pengguna => {
    const matchesSearch = pengguna.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pengguna.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || pengguna.role === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(pengguna.map(pengguna => pengguna.role))]

  const handleAdd = () => {
    setEditingPengguna(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (pengguna: Pengguna) => {
    setEditingPengguna(pengguna)
    setIsDialogOpen(true)
  }

  const handleDelete = (pengguna: Pengguna) => {
    setPenggunaToDelete(pengguna)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Pengguna, 'id'>) => {
  try {
    setSaving(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    };

    let response: Response;

    if (editingPengguna) {
      // UPDATE USER
      response = await fetch(API_ENDPOINTS.USER_BY_ID(editingPengguna.id), {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      // CREATE USER
      response = await fetch(API_ENDPOINTS.USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(errorData?.error || "Gagal menyimpan pengguna");
    }

    toast.success(editingPengguna ? "Berhasil update pengguna" : "Berhasil tambah pengguna");

    await fetchPengguna();
    setIsDialogOpen(false);
    setEditingPengguna(null);

  } catch (err) {
    console.error("Error saving pengguna:", err);
    toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
  } finally {
    setSaving(false);
  }
};

  const confirmDelete = async () => {
    if (!penggunaToDelete) return

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.USER_BY_ID(penggunaToDelete.id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menghapus pengguna')
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Pengguna berhasil dihapus')
        await fetchPengguna()
      } else {
        throw new Error(result.message || 'Gagal menghapus pengguna')
      }

    } catch (err: unknown) {
      console.error('Error deleting pengguna:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Terjadi kesalahan saat menghapus data')
      }
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setPenggunaToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Kategori: {selectedCategory === 'all' ? 'Semua' : selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map(category => (
              <DropdownMenuItem
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Semua Kategori' : category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <PenggunaTable
        users={filteredPengguna}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Dialog */}
      <PenggunaDialog
        key={editingPengguna ? editingPengguna.id : "new"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        pengguna={editingPengguna}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        pengguna={penggunaToDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}

