<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>SportBuddy 🏃</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-content">

      <!-- WELCOME -->
      <div class="welcome-section">
        <div>
          <p class="small-text">Selamat datang 👋</p>
          <h1>Halo, SportBuddy!</h1>
          <p class="subtitle">Siap latihan dan berkembang hari ini?</p>
        </div>

        <div class="profile-icon">👤</div>
      </div>


      <!-- STATISTIK HARI INI -->
      <div class="section-title">
        <h2>Aktivitas Hari Ini</h2>
      </div>

      <div class="stats-grid">

        <div class="stat-card">
          <div class="stat-icon">🏋️</div>
          <div>
            <h3>{{ stats.workout }}</h3>
            <p>Workout</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div>
            <h3>{{ stats.menit }}</h3>
            <p>Menit</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div>
            <h3>{{ stats.kalori }}</h3>
            <p>Kalori</p>
          </div>
        </div>

      </div>


      <!-- MENU UTAMA -->
      <div class="section-title">
        <h2>Menu Utama</h2>
      </div>

      <div class="menu-grid">

        <div class="menu-card workout" @click="goToWorkout">
          <div class="menu-icon">🏋️</div>
          <h3>Workout</h3>
          <p>Catat latihanmu</p>
        </div>

        <div class="menu-card jadwal" @click="goToJadwal">
          <div class="menu-icon">📅</div>
          <h3>Jadwal</h3>
          <p>Atur jadwal latihan</p>
        </div>

        <div class="menu-card progress" @click="goToProgress">
          <div class="menu-icon">📈</div>
          <h3>Progress</h3>
          <p>Lihat perkembangan</p>
        </div>

        <div class="menu-card rekomendasi" @click="goToRekomendasi">
          <div class="menu-icon">💡</div>
          <h3>Rekomendasi</h3>
          <p>Temukan latihan</p>
        </div>

      </div>


      <!-- AI BUDDY -->
      <div class="ai-card" @click="goToAI">

        <div class="ai-icon">🤖</div>

        <div class="ai-text">
          <h3>AI Buddy</h3>
          <p>Tanya seputar latihan dan program olahraga</p>
        </div>

        <div class="arrow">→</div>

      </div>


      <!-- STREAK -->
      <div class="streak-card">

        <div class="streak-icon">🔥</div>

        <div class="streak-text">
          <h3>7 Hari Streak!</h3>
          <p>Pertahankan konsistensimu dan jangan berhenti latihan.</p>
        </div>

      </div>


      <!-- JADWAL BERIKUTNYA -->
      <div class="section-title schedule-title">
        <h2>Jadwal Berikutnya</h2>

        <button @click="goToJadwal">Lihat semua</button>
      </div>

      <!-- Ada jadwal -->
      <div
        v-if="jadwalBerikutnya"
        class="next-workout"
        @click="goToJadwal"
      >

        <div class="calendar-icon">📅</div>

        <div class="workout-info">
          <h3>{{ jadwalBerikutnya.nama }}</h3>
          <p>{{ formatWaktu(jadwalBerikutnya.tanggal, jadwalBerikutnya.waktu) }}</p>
          <span>{{ jadwalBerikutnya.durasi }} menit • {{ jadwalBerikutnya.jenis }}</span>
        </div>

        <div class="arrow">→</div>

      </div>

      <!-- Belum ada jadwal -->
      <div
        v-else
        class="next-workout empty"
        @click="goToJadwal"
      >

        <div class="calendar-icon">📅</div>

        <div class="workout-info">
          <h3>Belum ada jadwal</h3>
          <p>Ketuk untuk menambah jadwal latihan</p>
        </div>

        <div class="arrow">→</div>

      </div>


      <!-- REKOMENDASI -->
      <div class="section-title schedule-title">
        <h2>Rekomendasi Untukmu</h2>

        <button @click="goToRekomendasi">Lihat semua</button>
      </div>


      <div class="recommendation-card" @click="goToRekomendasi">

        <div class="recommend-icon">🏃</div>

        <div class="recommend-info">
          <h3>Jogging Ringan</h3>
          <p>Cocok untuk meningkatkan stamina</p>

          <div class="recommend-detail">
            <span>⏱ 30 menit</span>
            <span>🔥 Sedang</span>
          </div>
        </div>

        <div class="arrow">→</div>

      </div>


      <!-- MOTIVASI -->
      <div class="motivation-card">

        <div class="motivation-icon">💪</div>

        <div>
          <h3>Keep Going!</h3>
          <p>
            Latihan kecil hari ini adalah langkah besar
            untuk tubuh yang lebih sehat.
          </p>
        </div>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getJadwalBerikutnya,
  type Jadwal
} from '../database/JadwalRepository'
import {
  getWorkouts,
  type Workout
} from '../database/workoutRepository'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  onIonViewWillEnter
} from '@ionic/vue'


const router = useRouter()


// ==============================
// DATA DARI SQLITE
// ==============================

const jadwalBerikutnya = ref<Jadwal | null>(null)

const stats = ref({ workout: 0, menit: 0, kalori: 0 })

const muatData = async () => {
  try {
    jadwalBerikutnya.value = await getJadwalBerikutnya()

    const workouts = await getWorkouts()
    const now = new Date()
    const awalHariIni = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime()
    const awalBesok = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    ).getTime()
    const workoutsHariIni = workouts.filter((workout: Workout) => {
      const waktuWorkout = new Date(workout.date).getTime()
      return waktuWorkout >= awalHariIni && waktuWorkout < awalBesok
    })

    stats.value = {
      workout: workoutsHariIni.length,
      menit: workoutsHariIni.reduce((total, workout) => total + workout.duration, 0),
      kalori: workoutsHariIni.reduce((total, workout) => total + workout.calories, 0)
    }
  } catch (err) {
    console.error('Gagal memuat data homepage:', err)
  }
}

onIonViewWillEnter(muatData)

const formatWaktu = (tanggal: string, waktu: string) => {
  return new Date(`${tanggal}T${waktu}`).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}


// ==============================
// KONSTANTA
// ==============================

const AI_PATH = '/ai'


// ==============================
// NAVIGASI
// ==============================

const goToWorkout = () => {
  router.push('/workout')
}

const goToJadwal = () => {
  router.push('/jadwal')
}

const goToProgress = () => {
  router.push('/progress')
}

const goToRekomendasi = () => {
  router.push('/rekomendasi')
}

const goToAI = () => {
  router.push(AI_PATH)
}

</script>


<style scoped>

/* ==============================
   TOKEN WARNA & DASAR
   ============================== */

.home-content {
  --background: #f2f5fa;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 32px;

  --card-bg: #ffffff;
  --text-main: #14213d;
  --text-soft: #5c6b85;
  --border-soft: #e3e9f3;
  --shadow-card: 0 1px 2px rgba(20, 33, 61, 0.06), 0 4px 14px rgba(20, 33, 61, 0.05);

  --blue: #0b63e5;
  --blue-soft: #e6f0ff;
  --amber: #f59e0b;
  --amber-soft: #fff4dc;
  --green: #16a34a;
  --green-soft: #e3f6ea;
  --violet: #7c3aed;
  --violet-soft: #f0e9ff;
  --fire: #ea580c;
  --fire-soft: #ffe9dc;

  color: var(--text-main);
}

@media (prefers-color-scheme: dark) {
  .home-content {
    --background: #0d1320;
    --card-bg: #172033;
    --text-main: #eef2fb;
    --text-soft: #9aa8c4;
    --border-soft: #26324b;
    --shadow-card: none;

    --blue-soft: #14305e;
    --amber-soft: #44330f;
    --green-soft: #123923;
    --violet-soft: #2e2150;
    --fire-soft: #4a2410;
  }
}

.home-content h1,
.home-content h2,
.home-content h3,
.home-content p {
  margin: 0;
}

.home-content p {
  color: var(--text-soft);
  line-height: 1.4;
}

/* Elemen yang bisa diketuk */
.menu-card,
.ai-card,
.next-workout,
.recommendation-card {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.12s ease;
}

.menu-card:active,
.ai-card:active,
.next-workout:active,
.recommendation-card:active {
  transform: scale(0.98);
}

.arrow {
  font-size: 20px;
  color: var(--text-soft);
  flex-shrink: 0;
}


/* ==============================
   WELCOME
   ============================== */

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.small-text {
  font-size: 14px;
  margin-bottom: 4px !important;
}

.welcome-section h1 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.subtitle {
  font-size: 15px;
  margin-top: 4px !important;
}

.profile-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border-radius: 50%;
  background: var(--blue-soft);
  border: 2px solid var(--blue);
}


/* ==============================
   JUDUL SECTION
   ============================== */

.section-title {
  margin: 28px 0 12px;
}

.section-title h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.schedule-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.schedule-title button {
  background: none;
  border: none;
  padding: 6px 0 6px 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--blue);
  cursor: pointer;
}


/* ==============================
   STATISTIK
   ============================== */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}

.stat-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  background: var(--blue-soft);
}

.stat-card:nth-child(2) .stat-icon {
  background: var(--amber-soft);
}

.stat-card:nth-child(3) .stat-icon {
  background: var(--fire-soft);
}

.stat-card h3 {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  color: var(--text-main);
}

.stat-card p {
  font-size: 13px;
  margin-top: 4px !important;
}


/* ==============================
   MENU UTAMA
   ============================== */

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.menu-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.menu-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 12px;
  background: var(--card-bg);
  margin-bottom: 14px;
}

.menu-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.menu-card p {
  font-size: 13px;
  margin-top: 4px !important;
}

.menu-card.workout {
  background: var(--blue-soft);
}

.menu-card.jadwal {
  background: var(--amber-soft);
}

.menu-card.progress {
  background: var(--green-soft);
}

.menu-card.rekomendasi {
  background: var(--violet-soft);
}


/* ==============================
   AI BUDDY
   ============================== */

.ai-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, #0b63e5, #5b3df0);
  box-shadow: 0 6px 18px rgba(11, 99, 229, 0.3);
}

.ai-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
}

.ai-text {
  flex: 1;
}

.ai-text h3 {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.ai-text p {
  margin-top: 2px !important;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.ai-card .arrow {
  color: #ffffff;
}


/* ==============================
   STREAK
   ============================== */

.streak-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 18px;
  background: var(--fire-soft);
  border: 1px solid var(--fire);
}

.streak-icon {
  font-size: 34px;
  flex-shrink: 0;
}

.streak-text h3 {
  font-size: 17px;
  font-weight: 800;
  color: var(--fire);
}

.streak-text p {
  margin-top: 2px !important;
  font-size: 13px;
}


/* ==============================
   JADWAL BERIKUTNYA
   ============================== */

.next-workout {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
}

.next-workout.empty {
  background: transparent;
  border: 2px dashed var(--border-soft);
  box-shadow: none;
}

.calendar-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 14px;
  background: var(--amber-soft);
}

.workout-info {
  flex: 1;
  min-width: 0;
}

.workout-info h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.workout-info p {
  margin-top: 2px !important;
  font-size: 13px;
}

.workout-info span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
}


/* ==============================
   REKOMENDASI
   ============================== */

.recommendation-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
}

.recommend-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 14px;
  background: var(--violet-soft);
}

.recommend-info {
  flex: 1;
  min-width: 0;
}

.recommend-info h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.recommend-info p {
  margin-top: 2px !important;
  font-size: 13px;
}

.recommend-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.recommend-detail span {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  background: var(--background, #f2f5fa);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}


/* ==============================
   MOTIVASI
   ============================== */

.motivation-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  padding: 18px;
  border-radius: 18px;
  background: var(--green-soft);
  border: 1px solid var(--green);
}

.motivation-icon {
  font-size: 34px;
  flex-shrink: 0;
}

.motivation-card h3 {
  font-size: 17px;
  font-weight: 800;
  color: var(--green);
}

.motivation-card p {
  margin-top: 4px !important;
  font-size: 13px;
}


/* ==============================
   LAYAR KECIL
   ============================== */

@media (max-width: 360px) {
  .stats-grid {
    gap: 8px;
  }

  .stat-card {
    padding: 12px 10px;
  }

  .welcome-section h1 {
    font-size: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-card,
  .ai-card,
  .next-workout,
  .recommendation-card {
    transition: none;
  }
}

</style>