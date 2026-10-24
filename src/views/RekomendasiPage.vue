<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Rekomendasi Latihan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="loading" class="center">
        <ion-spinner></ion-spinner>
        <p>Memuat daftar olahraga...</p>
      </div>

      <div v-else-if="error" class="center">
        <p>{{ error }}</p>
        <ion-button @click="muat">Coba Lagi</ion-button>
      </div>

      <div v-else-if="daftar.length === 0" class="center">
        <p>Belum ada data olahraga.</p>
      </div>

      <ion-card v-for="item in daftar" :key="item.id">
        <ion-card-header>
          <ion-card-title>{{ item.emoji }} {{ item.nama }}</ion-card-title>
          <ion-card-subtitle>
            {{ item.kategori }} · {{ item.tingkat }} · ± {{ item.kaloriPerJam }} kcal/jam
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <p v-if="item.deskripsi">{{ item.deskripsi }}</p>
          <p v-else class="kosong">Belum ada deskripsi.</p>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSpinner,
  onIonViewWillEnter
} from '@ionic/vue'

import { getOlahragaList, type Olahraga } from '../api/olahragaRepository'

const daftar = ref<Olahraga[]>([])
const loading = ref(false)
const error = ref('')

const muat = async () => {
  loading.value = true
  error.value = ''

  try {
    daftar.value = await getOlahragaList()
  } catch (e) {
    console.error(e)
    error.value = 'Tidak bisa memuat data. Pastikan server API (node server.js) berjalan.'
  } finally {
    loading.value = false
  }
}

onIonViewWillEnter(muat)
</script>

<style scoped>
.center {
  text-align: center;
  margin-top: 60px;
  color: #777;
}

ion-card {
  border-radius: 15px;
}

.kosong {
  color: #999;
  font-style: italic;
}
</style>