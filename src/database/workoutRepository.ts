import { Capacitor } from '@capacitor/core'
import { ensureDatabaseReady } from './database'

export interface Workout {
  id: number
  name: string
  sport: string
  date: string
  duration: number
  calories: number
  notes?: string
}

const STORAGE_KEY = 'sportbuddy_workouts'

/* ---------- Helper: pilih sumber data ---------- */

// Di HP (Android/iOS) -> SQLite. Di browser -> localStorage.
const useSqlite = () => Capacitor.isNativePlatform()

const getDb = async () => {
  const db = await ensureDatabaseReady()

  if (!db) {
    throw new Error('Database belum diinisialisasi')
  }

  return db
}

/* ---------- Helper: localStorage ---------- */

const readLocalWorkouts = (): Workout[] => {
  if (typeof localStorage === 'undefined') {
    return []
  }

  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw) as Workout[]
  } catch (error) {
    console.warn('Gagal membaca data lokal workout:', error)
    return []
  }
}

const writeLocalWorkouts = (items: Workout[]) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const sortByDateDesc = (items: Workout[]) =>
  [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

/* ---------- Helper: mapping baris SQLite ---------- */

const mapRowToWorkout = (row: Record<string, unknown>): Workout => ({
  id: Number(row.id ?? 0),
  name: String(row.name ?? row.nama ?? ''),
  sport: String(row.sport ?? row.jenis ?? ''),
  date: String(row.date ?? row.tanggal ?? new Date().toISOString()),
  duration: Number(row.duration ?? row.durasi ?? 0),
  calories: Number(row.calories ?? 0),
  notes: row.notes ? String(row.notes) : row.catatan ? String(row.catatan) : undefined
})

/* ---------- Ambil semua data workout ---------- */

export const getWorkouts = async (): Promise<Workout[]> => {
  if (!useSqlite()) {
    return sortByDateDesc(readLocalWorkouts())
  }

  const db = await getDb()

  const result = await db.query(`
    SELECT
      id,
      nama AS name,
      jenis AS sport,
      tanggal AS date,
      durasi AS duration,
      calories,
      catatan AS notes
    FROM workouts
    ORDER BY tanggal DESC
  `)

  const rows = (result.values || []) as Record<string, unknown>[]

  return rows.map(mapRowToWorkout)
}

/* ---------- Tambah workout ---------- */

export const addWorkout = async (
  name: string,
  sport: string,
  date: string,
  duration: number,
  calories: number,
  notes?: string
) => {
  if (!useSqlite()) {
    const items = readLocalWorkouts()

    const newItem: Workout = {
      id: Date.now(),
      name,
      sport,
      date,
      duration,
      calories,
      notes: notes ?? ''
    }

    writeLocalWorkouts([newItem, ...items])
    return
  }

  const db = await getDb()

  await db.run(
    `
    INSERT INTO workouts
    (nama, jenis, tanggal, durasi, calories, catatan)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, sport, date, duration, calories, notes ?? '']
  )
}

/* ---------- Update workout ---------- */

export const updateWorkout = async (
  id: number,
  name: string,
  sport: string,
  date: string,
  duration: number,
  calories: number,
  notes?: string
) => {
  if (!useSqlite()) {
    const items = readLocalWorkouts().map(item =>
      item.id === id
        ? { ...item, name, sport, date, duration, calories, notes: notes ?? '' }
        : item
    )

    writeLocalWorkouts(items)
    return
  }

  const db = await getDb()

  await db.run(
    `
    UPDATE workouts
    SET
      nama = ?,
      jenis = ?,
      tanggal = ?,
      durasi = ?,
      calories = ?,
      catatan = ?
    WHERE id = ?
    `,
    [name, sport, date, duration, calories, notes ?? '', id]
  )
}

/* ---------- Hapus workout ---------- */

export const deleteWorkout = async (id: number) => {
  if (!useSqlite()) {
    const items = readLocalWorkouts().filter(item => item.id !== id)
    writeLocalWorkouts(items)
    return
  }

  const db = await getDb()

  await db.run(`DELETE FROM workouts WHERE id = ?`, [id])
}