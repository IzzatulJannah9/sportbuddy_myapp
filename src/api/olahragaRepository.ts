export interface Olahraga {
  id: number
  nama: string
  kategori: string
  emoji: string
  tingkat: string
  pakaiJarak: boolean
  kaloriPerJam: number
  deskripsi: string
}

const daftarOlahraga: Olahraga[] = [
  {
    id: 1,
    nama: 'Lari',
    kategori: 'Kardio',
    emoji: '🏃',
    tingkat: 'Sedang',
    pakaiJarak: true,
    kaloriPerJam: 600,
    deskripsi: 'Cocok untuk meningkatkan stamina dan membakar kalori.',
  },
  {
    id: 2,
    nama: 'Jogging Ringan',
    kategori: 'Kardio',
    emoji: '🏃‍♂️',
    tingkat: 'Pemula',
    pakaiJarak: true,
    kaloriPerJam: 450,
    deskripsi: 'Lari santai untuk pemanasan dan menjaga kebugaran.',
  },
  {
    id: 3,
    nama: 'Bersepeda',
    kategori: 'Kardio',
    emoji: '🚴',
    tingkat: 'Pemula',
    pakaiJarak: true,
    kaloriPerJam: 500,
    deskripsi: 'Latihan sendi-friendly yang melatih kaki dan jantung.',
  },
  {
    id: 4,
    nama: 'Renang',
    kategori: 'Kardio',
    emoji: '🏊',
    tingkat: 'Menengah',
    pakaiJarak: true,
    kaloriPerJam: 550,
    deskripsi: 'Melatih seluruh otot tubuh dengan beban rendah pada sendi.',
  },
  {
    id: 5,
    nama: 'Jalan Kaki',
    kategori: 'Kardio',
    emoji: '🚶',
    tingkat: 'Pemula',
    pakaiJarak: true,
    kaloriPerJam: 250,
    deskripsi: 'Aktivitas ringan yang mudah dilakukan setiap hari.',
  },
  {
    id: 6,
    nama: 'Yoga',
    kategori: 'Fleksibilitas',
    emoji: '🧘',
    tingkat: 'Pemula',
    pakaiJarak: false,
    kaloriPerJam: 200,
    deskripsi: 'Meningkatkan kelenturan, keseimbangan, dan ketenangan.',
  },
  {
    id: 7,
    nama: 'Angkat Beban',
    kategori: 'Kekuatan',
    emoji: '🏋️',
    tingkat: 'Menengah',
    pakaiJarak: false,
    kaloriPerJam: 350,
    deskripsi: 'Membangun massa otot dan kekuatan tubuh.',
  },
  {
    id: 8,
    nama: 'Push Up',
    kategori: 'Kekuatan',
    emoji: '💪',
    tingkat: 'Pemula',
    pakaiJarak: false,
    kaloriPerJam: 300,
    deskripsi: 'Latihan beban tubuh untuk dada, bahu, dan lengan.',
  },
]

export const getOlahragaList = async (): Promise<Olahraga[]> => {
  return daftarOlahraga
}