'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Pengguna {
  id: number,
  name: string,
  email: string,
  role: string,
  status: 'active' | 'inactive'
}

interface PenggunaTableProps {
  users: Pengguna[]
  onEdit: (pengguna: Pengguna) => void
  onDelete: (pengguna: Pengguna) => void
  onStatusChange: (id: number, newStatus: 'active' | 'inactive') => void
  loading?: boolean
  error?: string | null
  updatingStatus?: boolean
}

export function PenggunaTable({ 
  users, 
  onDelete, 
  onStatusChange, 
  loading, 


  
  error, 
  updatingStatus 
}: PenggunaTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    setUpdatingId(id)
    try {
      await onStatusChange(id, newStatus)
    } finally {
      setUpdatingId(null)
    }
  }

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 px-2 hover:bg-transparent"
                      disabled={updatingStatus && updatingId === pengguna.id}
                    >
                      <Badge 
                        className={`
                          ${pengguna.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}
                          cursor-pointer transition-colors
                          ${updatingStatus && updatingId === pengguna.id ? 'opacity-50' : ''}
                        `}
                      >
                        {updatingStatus && updatingId === pengguna.id ? (
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 bg-current rounded-full animate-pulse"></span>
                            Mengubah...
                          </span>
                        ) : (
                          pengguna.status === 'active' ? 'Aktif' : 'Nonaktif'
                        )}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(pengguna.id, 'active')}
                      disabled={pengguna.status === 'active' || (updatingStatus && updatingId === pengguna.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Aktif</span>
                        {pengguna.status === 'active' && (
                          <span className="text-xs text-gray-500 ml-auto">✓</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(pengguna.id, 'inactive')}
                      disabled={pengguna.status === 'inactive' || (updatingStatus && updatingId === pengguna.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span>Nonaktif</span>
                        {pengguna.status === 'inactive' && (
                          <span className="text-xs text-gray-500 ml-auto">✓</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onDelete(pengguna)}
                    className='bg-red-500 text-white hover:bg-red-600 hover:text-white'
                  >
                    <Trash2 className="h-4 w-4" />
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