import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET all students
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id ASC')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching students' }, { status: 500 })
  }
}

// POST new student
export async function POST(request: Request) {
  try {
    const { full_name, class: studentClass, residence, aspiration } = await request.json()
    const result = await pool.query(
      'INSERT INTO students (full_name, class, residence, aspiration) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, studentClass, residence, aspiration]
    )
    return NextResponse.json(result.rows[0])
  } catch (error: Error | unknown) {
    console.error('Detailed error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: `Error adding student: ${message}` }, { status: 500 })
  }
}

