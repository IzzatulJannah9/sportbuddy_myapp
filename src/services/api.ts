export const jenisOlahraga = ["Lari", "Bersepeda", "Renang", "Jalan Kaki", "Yoga"];

export const rekomendasiLatihan = [
  { id: 1, nama: "Lari Pagi 3 km", durasi: 30, kalori: 220, level: "Pemula" },
  { id: 2, nama: "Bersepeda Santai", durasi: 45, kalori: 300, level: "Pemula" },
  { id: 3, nama: "Renang 20 Menit", durasi: 20, kalori: 250, level: "Menengah" },
];

export interface Progress {
  id: number;
  olahraga: string;
  tanggal: string;
  jarak: number;
  durasi: number;
  kalori: number;
  catatan: string;
}

const KEY = "progress";

export const getJenisOlahraga = () => jenisOlahraga;
export const getRekomendasi = () => rekomendasiLatihan;

export const getProgress = (): Progress[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const addProgress = (data: Omit<Progress, "id">) => {
  const list = getProgress();
  list.unshift({ ...data, id: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const deleteProgress = (id: number) => {
  localStorage.setItem(
    KEY,
    JSON.stringify(getProgress().filter((p) => p.id !== id))
  );
};