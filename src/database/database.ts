import { Capacitor } from '@capacitor/core'
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite'

let sqlite: SQLiteConnection | null = null
let db: SQLiteDBConnection | null = null
let initPromise: Promise<SQLiteDBConnection | null> | null = null

const createTables = async () => {
  if (!db) {
    throw new Error('Database belum diinisialisasi')
  }

  const workoutQuery = `
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      jenis TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      durasi INTEGER NOT NULL,
      calories INTEGER DEFAULT 0,
      catatan TEXT
    );
  `

  await db.execute(workoutQuery)

  try {
    await db.execute(`
      ALTER TABLE workouts
      ADD COLUMN calories INTEGER DEFAULT 0;
    `)
  } catch (error) {
    // Kolom sudah ada, jadi tidak masalah
  }

  const progressQuery = `
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      jarak REAL DEFAULT 0,
      durasi INTEGER NOT NULL,
      kalori INTEGER DEFAULT 0,
      catatan TEXT
    );
  `

  await db.execute(progressQuery)

  console.log('✅ Tabel workouts dan progress berhasil dibuat')
}

export const initDatabase = async () => {
  if (db) {
    return db
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    try {
      sqlite = new SQLiteConnection(CapacitorSQLite)

      const platform = Capacitor.getPlatform()

      // Untuk Android/iOS
      if (platform !== 'web') {
        db = await sqlite.createConnection(
          'sportbuddy',
          false,
          'no-encryption',
          1,
          false
        )

        await db.open()
      }

      // Untuk browser/web
      else {
        await sqlite.initWebStore()

        db = await sqlite.createConnection(
          'sportbuddy',
          false,
          'no-encryption',
          1,
          false
        )

        await db.open()
      }

      await createTables()

      console.log('✅ Database SportBuddy berhasil dibuat')

      return db
    } catch (error) {
      console.error('❌ Gagal membuat database:', error)
      throw error
    } finally {
      initPromise = null
    }
  })()

  return initPromise
}

export const getDatabase = () => {
  return db
}

export const ensureDatabaseReady = async () => {
  if (db) {
    return db
  }

  return initDatabase()
}