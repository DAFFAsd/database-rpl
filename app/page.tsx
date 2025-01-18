'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Student {
  id: number
  full_name: string
  class: string
  residence: string
  aspiration: string
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    full_name: '',
    class: '',
    residence: '',
    aspiration: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      await fetch(`/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    } else {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    }
    setFormData({ full_name: '', class: '', residence: '', aspiration: '' })
    setEditingId(null)
    fetchStudents()
    router.refresh()
  }

  async function handleDelete(id: number) {
    await fetch(`/api/students/${id}`, { method: 'DELETE' })
    fetchStudents()
    router.refresh()
  }

  function handleEdit(student: Student) {
    setFormData(student)
    setEditingId(student.id)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Murid RPL AL-Jihad</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <Input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          placeholder="Nama Lengkap"
          required
        />
        <Input
          type="text"
          name="class"
          value={formData.class}
          onChange={handleInputChange}
          placeholder="Kelas"
          required
        />
        <Input
          type="text"
          name="residence"
          value={formData.residence}
          onChange={handleInputChange}
          placeholder="Tempat Tinggal"
          required
        />
        <Input
          type="text"
          name="aspiration"
          value={formData.aspiration}
          onChange={handleInputChange}
          placeholder="Cita-cita"
          required
        />
        <Button type="submit">
          {editingId ? 'Update' : 'Tambah'} Siswa
        </Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Lengkap</TableHead>
            <TableHead>Kelas</TableHead>
            <TableHead>Tempat Tinggal</TableHead>
            <TableHead>Cita-cita</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.full_name}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.residence}</TableCell>
              <TableCell>{student.aspiration}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEdit(student)}
                  variant="outline"
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(student.id)}
                  variant="destructive"
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

