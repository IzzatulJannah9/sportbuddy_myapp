export interface Jadwal {
  id: number
  nama: string
  jenis: string
  tanggal: string // format YYYY-MM-DD
  waktu: string // format HH:mm
  durasi: number
}

const STORAGE_KEY = 'sportbuddy_jadwal'

const defaultJadwal: Jadwal[] = [
  {
    id: 1,
    nama: 'Lari Pagi',
    jenis: 'Kardio',
    tanggal: '2026-09-25',
    waktu: '07:00',
    durasi: 30
  },
  {
    id: 2,
    nama: 'Push Up',
    jenis: 'Kekuatan',
    tanggal: '2026-09-26',
    waktu: '16:00',
    durasi: 20
  }
]

const read = (): Jadwal[] => {
  const raw = localStorage.getItem(STORAGE_KEY)

  // Data awal hanya dibuat sekali, saat belum pernah ada penyimpanan.
  if (raw === null) {
    write(defaultJadwal)
    return [...defaultJadwal]
  }

  try {
    return JSON.parse(raw) as Jadwal[]
  } catch (error) {
    console.warn('Gagal membaca data jadwal:', error)
    return []
  }
}

const write = (items: Jadwal[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const getJadwalList = async (): Promise<Jadwal[]> => {
  return [...read()].sort((a, b) =>
    `${a.tanggal} ${a.waktu}`.localeCompare(`${b.tanggal} ${b.waktu}`)
  )
}

export const getJadwalBerikutnya = async (): Promise<Jadwal | null> => {
  const now = Date.now()

  return (await getJadwalList())
    .filter(item => {
      const waktuJadwal = new Date(`${item.tanggal}T${item.waktu}`).getTime()
      return Number.isFinite(waktuJadwal) && waktuJadwal >= now
    })
    .sort((a, b) =>
      new Date(`${a.tanggal}T${a.waktu}`).getTime() -
      new Date(`${b.tanggal}T${b.waktu}`).getTime()
    )[0] ?? null
}

export const getJadwalById = async (id: number): Promise<Jadwal | undefined> => {
  return read().find(item => item.id === id)
}

export const addJadwal = async (data: Omit<Jadwal, 'id'>) => {
  const items = read()
  items.push({ ...data, id: Date.now() })
  write(items)
}

export const updateJadwal = async (id: number, data: Omit<Jadwal, 'id'>) => {
  const items = read().map(item =>
    item.id === id ? { ...item, ...data } : item
  )
  write(items)
}

export const deleteJadwal = async (id: number) => {
  write(read().filter(item => item.id !== id))
}