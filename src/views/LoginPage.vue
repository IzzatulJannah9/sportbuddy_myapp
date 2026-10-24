<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="page">

        <!-- Decorative blobs -->
        <div class="blob blob-one"></div>
        <div class="blob blob-two"></div>
        <div class="blob blob-three"></div>

        <!-- Logo -->
        <div class="logo-section">
          <div class="logo">🏃‍♀️</div>
          <h1>SportBuddy</h1>
          <p>Your personal workout companion</p>
        </div>

        <!-- Card -->
        <div class="card">

          <h2>Welcome 👋</h2>
          <p class="subtitle">Login untuk melanjutkan perjalananmu</p>

          <!-- Email -->
          <div class="input-group">
            <label>Email</label>
            <div class="input-box">
              <span class="icon">✉️</span>
              <input
                v-model="email"
                type="email"
                placeholder="Masukkan email"
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="input-group">
            <label>Password</label>
            <div class="input-box">
              <span class="icon">🔒</span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                autocomplete="current-password"
                @keyup.enter="login"
              />
              <span class="eye" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </span>
            </div>
          </div>

          <div class="forgot">
            <span @click="forgotPassword">Lupa password?</span>
          </div>

          <button class="btn" @click="login" :disabled="loading">
            {{ loading ? 'Memproses...' : 'Login' }}
            <span v-if="!loading" class="arrow">→</span>
          </button>

          <div class="switch">
            <span>Belum punya akun?</span>
            <strong @click="router.push('/register')"> Daftar</strong>
          </div>

        </div>

        <p class="quote">“Small steps. Big progress. 💙”</p>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue'
import { IonPage, IonContent, toastController } from '@ionic/vue'
import { useRouter } from 'vue-router'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const showToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 3500,
    position: 'top'
  })
  await toast.present()
}

// Kalau sudah login, langsung ke home
let unsub: (() => void) | undefined

onMounted(() => {
  unsub = onAuthStateChanged(auth, (user) => {
    if (user) router.replace('/home')
  })
})

onUnmounted(() => {
  if (unsub) unsub()
})

const login = async () => {

  if (!email.value || !password.value) {
    showToast('Email dan password harus diisi!')
    return
  }

  loading.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    router.replace('/home')
  } catch (e: any) {
    console.error('LOGIN ERROR:', e.code, e.message)

    switch (e.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        showToast('Email atau password salah, atau akun belum terdaftar')
        break
      case 'auth/invalid-email':
        showToast('Format email tidak valid')
        break
      case 'auth/too-many-requests':
        showToast('Terlalu banyak percobaan, coba lagi nanti')
        break
      case 'auth/network-request-failed':
        showToast('Tidak ada koneksi internet')
        break
      case 'auth/operation-not-allowed':
        showToast('Email/Password belum diaktifkan di Firebase Console')
        break
      case 'auth/invalid-api-key':
        showToast('API key Firebase salah, cek file src/firebase.ts')
        break
      default:
        showToast('Gagal login: ' + (e.code || e.message))
    }
  } finally {
    loading.value = false
  }

}

const forgotPassword = async () => {

  if (!email.value) {
    showToast('Isi email dulu, lalu klik Lupa password')
    return
  }

  try {
    await sendPasswordResetEmail(auth, email.value.trim())
    showToast('Link reset password dikirim ke email kamu (cek folder spam)')
  } catch (e: any) {
    console.error('RESET ERROR:', e.code, e.message)
    if (e.code === 'auth/invalid-email') showToast('Format email tidak valid')
    else showToast('Gagal mengirim email reset: ' + (e.code || e.message))
  }

}

</script>

<style scoped>

* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 55px 24px 30px;
  background: linear-gradient(160deg, #e0f2fe 0%, #eff6ff 45%, #ffffff 100%);
}

/* BLOBS */

.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(2px);
}

.blob-one {
  width: 230px;
  height: 230px;
  top: -90px;
  right: -70px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.28), rgba(37, 99, 235, 0.04));
  animation: float 7s ease-in-out infinite;
}

.blob-two {
  width: 170px;
  height: 170px;
  bottom: 60px;
  left: -80px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.25), rgba(14, 165, 233, 0.03));
  animation: float 9s ease-in-out infinite reverse;
}

.blob-three {
  width: 90px;
  height: 90px;
  top: 38%;
  right: -30px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.22), rgba(99, 102, 241, 0.02));
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

/* LOGO */

.logo-section {
  text-align: center;
  position: relative;
  z-index: 2;
  animation: fadeUp 0.6s ease both;
}

.logo {
  width: 82px;
  height: 82px;
  margin: auto;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: linear-gradient(145deg, #3b82f6, #1d4ed8);
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.35);
}

.logo-section h1 {
  margin: 18px 0 5px;
  font-size: 31px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #1e3a8a, #2563eb, #0ea5e9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-section p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

/* CARD */

.card {
  position: relative;
  z-index: 2;
  margin-top: 36px;
  padding: 30px 22px 26px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  box-shadow: 0 24px 60px rgba(30, 64, 175, 0.14);
  animation: fadeUp 0.7s ease 0.1s both;
}

.card h2 {
  margin: 0;
  color: #0f2a5c;
  font-size: 24px;
  font-weight: 800;
}

.subtitle {
  margin: 7px 0 26px;
  color: #94a3b8;
  font-size: 12.5px;
}

/* INPUT */

.input-group {
  margin-bottom: 17px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.input-box {
  height: 54px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  background: #f1f5f9;
  border: 1.5px solid transparent;
  border-radius: 16px;
  transition: all 0.2s ease;
}

.input-box:focus-within {
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.icon {
  font-size: 16px;
}

.eye {
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

.input-box input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1e293b;
}

.input-box input::placeholder {
  color: #a6b2c3;
}

/* FORGOT */

.forgot {
  text-align: right;
  margin: 2px 0 22px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.forgot span,
.switch strong {
  cursor: pointer;
}

/* BUTTON */

.btn {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:active {
  transform: scale(0.98);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.arrow {
  font-size: 20px;
}

/* SWITCH */

.switch {
  text-align: center;
  margin-top: 24px;
  font-size: 12px;
  color: #94a3b8;
}

.switch strong {
  color: #2563eb;
}

/* QUOTE */

.quote {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 28px;
  color: #94a3b8;
  font-size: 11.5px;
  font-style: italic;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>