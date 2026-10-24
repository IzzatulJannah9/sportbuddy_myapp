<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>

        <ion-title>Jadwal Latihan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-button expand="block" @click="tambahJadwal">
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Tambah Jadwal
      </ion-button>

      <div v-if="jadwal.length === 0" class="empty">
        <h2>📅</h2>
        <p>Belum ada jadwal latihan.</p>
      </div>

      <ion-card v-for="item in jadwal" :key="item.id">
        <ion-card-header>
          <ion-card-title>
            {{ item.nama }}
          </ion-card-title>

          <ion-card-subtitle>
            {{ item.jenis }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <p>📅 {{ formatTanggal(item.tanggal) }}</p>
          <p>⏰ {{ item.waktu }}</p>
          <p>⏱️ {{ item.durasi }} menit</p>

          <div class="buttons">
            <ion-button
              size="small"
              @click="editJadwal(item.id)"
            >
              <ion-icon :icon="createOutline"></ion-icon>
              Edit
            </ion-button>

            <ion-button
              size="small"
              color="danger"
              @click="hapusJadwal(item.id)"
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
  getJadwalList,
  deleteJadwal,
  type Jadwal
} from '../database/JadwalRepository'

const router = useRouter()

const jadwal = ref<Jadwal[]>([])

const loadJadwal = async () => {
  jadwal.value = await getJadwalList()
}

// Dimuat ulang setiap halaman ini tampil (termasuk setelah kembali dari form).
onIonViewWillEnter(loadJadwal)

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

const tambahJadwal = () => {
  router.push('/jadwal/tambah')
}

const editJadwal = (id: number) => {
  router.push(`/jadwal/edit/${id}`)
}

const hapusJadwal = async (id: number) => {
  const alert = await alertController.create({
    header: 'Hapus Jadwal',
    message: 'Apakah kamu yakin ingin menghapus jadwal ini?',
    buttons: [
      {
        text: 'Batal',
        role: 'cancel'
      },
      {
        text: 'Hapus',
        role: 'destructive',
        handler: async () => {
          await deleteJadwal(id)
          await loadJadwal()
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

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

ion-card {
  border-radius: 15px;
}
</style>