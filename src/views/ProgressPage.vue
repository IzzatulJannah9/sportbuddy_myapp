<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>

        <ion-title>Progress Latihan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-button expand="block" @click="tambahProgress">
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Tambah Progress
      </ion-button>

      <div v-if="progressList.length === 0" class="empty">
        <h2>📈</h2>
        <p>Belum ada data progress.</p>
      </div>

      <ion-card v-for="item in progressList" :key="item.id">
        <ion-card-header>
          <ion-card-title>
            {{ item.nama }}
          </ion-card-title>

          <ion-card-subtitle>
            {{ formatTanggal(item.tanggal) }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>

          <div class="stats">
            <div class="stat">
              <span>🏃 Jarak</span>
              <strong>{{ item.jarak }} km</strong>
            </div>

            <div class="stat">
              <span>⏱️ Durasi</span>
              <strong>{{ item.durasi }} menit</strong>
            </div>

            <div class="stat">
              <span>🔥 Kalori</span>
              <strong>{{ item.kalori }} kcal</strong>
            </div>
          </div>

          <p v-if="item.catatan" class="catatan">
            📝 {{ item.catatan }}
          </p>

          <div class="buttons">
            <ion-button
              size="small"
              @click="editProgress(item.id)"
            >
              <ion-icon :icon="createOutline"></ion-icon>
              Edit
            </ion-button>

            <ion-button
              size="small"
              color="danger"
              @click="hapusProgress(item.id)"
            >
              <ion-icon :icon="trashOutline"></ion-icon>
              Hapus
            </ion-button>
          </div>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  alertController,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  addOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons'

import {
  getProgressList,
  deleteProgress,
  type Progress
} from '../database/Progressrepository'

const router = useRouter()

const progressList = ref<Progress[]>([])

const loadProgress = async () => {
  progressList.value = await getProgressList()
}

// Dimuat ulang setiap halaman ini tampil (termasuk setelah kembali dari form).
onIonViewWillEnter(loadProgress)

const formatTanggal = (tanggal: string) => {
  const date = new Date(`${tanggal}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return tanggal
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const tambahProgress = () => {
  router.push('/progress/tambah')
}

const editProgress = (id: number) => {
  router.push(`/progress/edit/${id}`)
}

const hapusProgress = async (id: number) => {
  const alert = await alertController.create({
    header: 'Hapus Progress',
    message: 'Apakah kamu yakin ingin menghapus data ini?',
    buttons: [
      {
        text: 'Batal',
        role: 'cancel'
      },
      {
        text: 'Hapus',
        role: 'destructive',
        handler: async () => {
          await deleteProgress(id)
          await loadProgress()
        }
      }
    ]
  })

  await alert.present()
}
</script>

<style scoped>
.empty {
  text-align: center;
  margin-top: 80px;
  color: #777;
}

.empty h2 {
  font-size: 50px;
}

ion-card {
  border-radius: 15px;
}

.stats {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 6px;
  border-radius: 10px;
  background: #f4f4f4;
  font-size: 12px;
  color: #555;
}

.stat strong {
  font-size: 14px;
  color: #333;
}

.catatan {
  margin-top: 14px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
</style>