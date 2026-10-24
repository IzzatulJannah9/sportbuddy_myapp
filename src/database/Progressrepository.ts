export interface Progress {
  id: number
  nama: string
  tanggal: string // YYYY-MM-DD
  jarak: number
  durasi: number
  kalori: number
  catatan: string
}

const STORAGE_KEY = 'sportbuddy_progress'

const write = (items: Progress[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const read = (): Progress[] => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return []

  try {
    return JSON.parse(raw) as Progress[]
  } catch (error) {
    console.warn('Gagal membaca data progress:', error)
    return []
  }
}

export const getProgressList = async (): Promise<Progress[]> => {
  // Terbaru di atas
  return [...read()].sort((a, b) => b.tanggal.localeCompare(a.tanggal))
}

export const getProgressById = async (id: number): Promise<Progress | undefined> => {
  return read().find(item => item.id === id)
}

export const addProgress = async (data: Omit<Progress, 'id'>) => {
  const items = read()
  items.push({ ...data, id: Date.now() })
  write(items)
}

export const updateProgress = async (id: number, data: Omit<Progress, 'id'>) => {
  write(read().map(item => (item.id === id ? { ...item, ...data } : item)))
}

export const deleteProgress = async (id: number) => {
  write(read().filter(item => item.id !== id))
}