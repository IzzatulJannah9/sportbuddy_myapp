import { createRouter, createWebHistory } from '@ionic/vue-router'

// ==============================
// IMPORT HALAMAN
// ==============================

import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/Registerpage.vue'
import HomePage from '../views/HomePage.vue'
import WorkoutPage from '../views/WorkoutPage.vue'

// Jadwal
import JadwalPage from '../views/JadwalPage.vue'
import FormJadwalPage from '../views/FormJadwalPage.vue'

// Progress
import ProgressPage from '../views/ProgressPage.vue'
import FormProgressPage from '../views/FormProgressPage.vue'

// Rekomendasi
import RekomendasiPage from '../views/RekomendasiPage.vue'

// AI
import AiSaranPage from '../views/AiSaranPage.vue'


// ==============================
// ROUTES
// ==============================

const routes = [

  // ============================
  // HALAMAN AWAL
  // ============================
  {
    path: '/',
    redirect: '/login'
  },


  // ============================
  // LOGIN
  // ============================
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },


  // ============================
  // REGISTER (DAFTAR AKUN)
  // ============================
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },


  // ============================
  // HOME / DASHBOARD
  // ============================
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },


  // ============================
  // WORKOUT
  // ============================
  {
    path: '/workout',
    name: 'Workout',
    component: WorkoutPage
  },


  // ============================
  // JADWAL
  // ============================
  {
    path: '/jadwal',
    name: 'Jadwal',
    component: JadwalPage
  },

  // Tambah Jadwal
  {
    path: '/jadwal/tambah',
    name: 'TambahJadwal',
    component: FormJadwalPage
  },

  // Edit Jadwal
  {
    path: '/jadwal/edit/:id',
    name: 'EditJadwal',
    component: FormJadwalPage
  },


  // ============================
  // PROGRESS
  // ============================
  {
    path: '/progress',
    name: 'Progress',
    component: ProgressPage
  },

  // Tambah Progress
  {
    path: '/progress/tambah',
    name: 'TambahProgress',
    component: FormProgressPage
  },

  // Edit Progress
  {
    path: '/progress/edit/:id',
    name: 'EditProgress',
    component: FormProgressPage
  },


  // ============================
  // REKOMENDASI
  // ============================
  {
    path: '/rekomendasi',
    name: 'Rekomendasi',
    component: RekomendasiPage
  },


  // ============================
  // TANYA AI
  // ============================
  {
    path: '/ai',
    name: 'AiSaran',
    component: AiSaranPage
  }

]


// ==============================
// CREATE ROUTER
// ==============================

const router = createRouter({

  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes

})


// ==============================
// EXPORT ROUTER
// ==============================

export default router