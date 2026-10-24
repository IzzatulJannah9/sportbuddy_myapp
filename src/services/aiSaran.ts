import { getOlahragaList, type Olahraga } from '../api/olahragaRepository'

const format = (judul: string, items: Olahraga[]) => {
  if (items.length === 0) return 'Belum ada olahraga yang cocok dengan pertanyaanmu.'

  const baris = items.map(
    o => `${o.emoji} ${o.nama} (${o.tingkat}, ±${o.kaloriPerJam} kcal/jam)\n   ${o.deskripsi}`
  )
  return `${judul}:\n\n${baris.join('\n\n')}`
}

export const getSaranAI = async (pertanyaan: string): Promise<string> => {
  const q = pertanyaan.toLowerCase()
  const list = await getOlahragaList()

  if (/pemula|baru mulai|ringan|santai/.test(q)) {
    return format('Olahraga yang cocok untuk pemula', list.filter(o => o.tingkat === 'Pemula'))
  }

  if (/bakar|kalori|turun berat|diet|kurus/.test(q)) {
    const top = [...list].sort((a, b) => b.kaloriPerJam - a.kaloriPerJam).slice(0, 3)
    return format('Olahraga dengan pembakaran kalori tertinggi', top)
  }

  if (/otot|kuat|beban|massa/.test(q)) {
    return format('Olahraga untuk membangun kekuatan', list.filter(o => o.kategori === 'Kekuatan'))
  }

  if (/lentur|fleksibel|stres|rileks|tenang/.test(q)) {
    return format('Olahraga untuk kelenturan dan ketenangan', list.filter(o => o.kategori === 'Fleksibilitas'))
  }

  if (/stamina|jantung|kardio|napas|lari/.test(q)) {
    return format('Olahraga kardio untuk stamina', list.filter(o => o.kategori === 'Kardio'))
  }

  return (
    'Saya belum paham pertanyaanmu. Coba tanyakan, misalnya:\n' +
    '• olahraga khusus pemula\n• olahraga untuk bakar kalori\n' +
    '• olahraga untuk membentuk otot\n• olahraga untuk meningkatkan stamina'
  )
}