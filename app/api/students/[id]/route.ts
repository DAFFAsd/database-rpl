import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// PUT (update) student
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { fullName, class: studentClass, residence, aspiration } = await request.json()
    const result = await pool.query(
      'UPDATE students SET full_name = $1, class = $2, residence = $3, aspiration = $4 WHERE id = $5 RETURNING *',
      [fullName, studentClass, residence, aspiration, params.id]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error updating student' }, { status: 500 })
  }
}

// DELETE student
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [params.id])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error deleting student' }, { status: 500 })
  }
}

