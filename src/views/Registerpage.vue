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

          <h2>Buat Akun 🚀</h2>
          <p class="subtitle">Daftar untuk mulai perjalananmu</p>

          <!-- Nama -->
          <div class="input-group">
            <label>Nama</label>
            <div class="input-box">
              <span class="icon">👤</span>
              <input
                v-model="name"
                type="text"
                placeholder="Masukkan nama"
                autocomplete="name"
              />
            </div>
          </div>

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
                placeholder="Minimal 6 karakter"
                autocomplete="new-password"
              />
              <span class="eye" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </span>
            </div>
          </div>

          <!-- Konfirmasi -->
          <div class="input-group">
            <label>Konfirmasi Password</label>
            <div class="input-box">
              <span class="icon">🔒</span>
              <input
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ulangi password"
                autocomplete="new-password"
                @keyup.enter="register"
              />
            </div>
          </div>

          <button class="btn" @click="register" :disabled="loading">
            {{ loading ? 'Memproses...' : 'Daftar' }}
            <span v-if="!loading" class="arrow">→</span>
          </button>

          <div class="switch">
            <span>Sudah punya akun?</span>
            <strong @click="router.push('/login')"> Login</strong>
          </div>

        </div>

        <p class="quote">“Small steps. Big progress. 💙”</p>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { IonPage, IonContent, toastController } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
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

const register = async () => {

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    showToast('Semua kolom harus diisi!')
    return
  }

  if (password.value.length < 6) {
    showToast('Password minimal 6 karakter')
    return
  }

  if (password.value !== confirmPassword.value) {
    showToast('Konfirmasi password tidak sama')
    return
  }

  loading.value = true

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )
    await updateProfile(cred.user, { displayName: name.value.trim() })
    showToast('Akun berhasil dibuat!')
    router.replace('/home')
  } catch (e: any) {
    console.error('REGISTER ERROR:', e.code, e.message)

    switch (e.code) {
      case 'auth/email-already-in-use':
        showToast('Email sudah terdaftar')
        break
      case 'auth/invalid-email':
        showToast('Format email tidak valid')
        break
      case 'auth/weak-password':
        showToast('Password terlalu lemah')
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
        showToast('Gagal mendaftar: ' + (e.code || e.message))
    }
  } finally {
    loading.value = false
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
  padding: 45px 24px 30px;
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
  width: 72px;
  height: 72px;
  margin: auto;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  background: linear-gradient(145deg, #3b82f6, #1d4ed8);
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.35);
}

.logo-section h1 {
  margin: 14px 0 5px;
  font-size: 29px;
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
  margin-top: 28px;
  padding: 28px 22px 26px;
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
  margin: 7px 0 24px;
  color: #94a3b8;
  font-size: 12.5px;
}

/* INPUT */

.input-group {
  margin-bottom: 16px;
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

/* BUTTON */

.btn {
  width: 100%;
  height: 56px;
  margin-top: 8px;
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
  cursor: pointer;
}

/* QUOTE */

.quote {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 26px;
  color: #94a3b8;
  font-size: 11.5px;
  font-style: italic;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>