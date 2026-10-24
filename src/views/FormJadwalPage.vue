<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/jadwal"></ion-back-button>
        </ion-buttons>

        <ion-title>
          {{ editingId ? 'Edit Jadwal' : 'Tambah Jadwal' }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-item>
        <ion-label position="stacked">Nama Latihan</ion-label>
        <ion-input
          v-model="form.nama"
          placeholder="Contoh: Lari Pagi"
        />
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Jenis</ion-label>
        <ion-select
          v-model="form.jenis"
          placeholder="Pilih jenis"
        >
          <ion-select-option value="Kardio">Kardio</ion-select-option>
          <ion-select-option value="Kekuatan">Kekuatan</ion-select-option>
          <ion-select-option value="Fleksibilitas">Fleksibilitas</ion-select-option>
          <ion-select-option value="Lainnya">Lainnya</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Tanggal</ion-label>
        <ion-input
          v-model="form.tanggal"
          type="date"
        />
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Waktu</ion-label>
        <ion-input
          v-model="form.waktu"
          type="time"
        />
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Durasi (menit)</ion-label>
        <ion-input
          v-model.number="form.durasi"
          type="number"
          placeholder="30"
        />
      </ion-item>

      <div class="form-buttons">
        <ion-button expand="block" @click="save">
          {{ editingId ? 'Update Jadwal' : 'Simpan Jadwal' }}
        </ion-button>

        <ion-button expand="block" fill="outline" @click="cancel">
          Batal
        </ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  addJadwal,
  updateJadwal,
  getJadwalById
} from '../database/JadwalRepository'

const route = useRoute()
const router = useRouter()

const editingId = ref<number | null>(null)

const emptyForm = () => ({
  nama: '',
  jenis: '',
  tanggal: '',
  waktu: '',
  durasi: 30
})

const form = ref(emptyForm())

// Dijalankan setiap halaman tampil, supaya form selalu sesuai mode (tambah/edit).
onIonViewWillEnter(async () => {
  const idParam = route.params.id

  if (idParam) {
    const id = Number(idParam)
    const data = await getJadwalById(id)

    if (data) {
      editingId.value = id
      form.value = {
        nama: data.nama,
        jenis: data.jenis,
        tanggal: data.tanggal,
        waktu: data.waktu,
        durasi: data.durasi
      }
      return
    }
  }

  editingId.value = null
  form.value = emptyForm()
})

const save = async () => {
  if (
    !form.value.nama ||
    !form.value.jenis ||
    !form.value.tanggal ||
    !form.value.waktu ||
    !form.value.durasi
  ) {
    alert('Semua data jadwal wajib diisi.')
    return
  }

  const data = {
    nama: form.value.nama,
    jenis: form.value.jenis,
    tanggal: form.value.tanggal,
    waktu: form.value.waktu,
    durasi: Number(form.value.durasi)
  }

  try {
    if (editingId.value) {
      await updateJadwal(editingId.value, data)
    } else {
      await addJadwal(data)
    }

    router.replace('/jadwal')
  } catch (error) {
    console.error('Simpan jadwal gagal:', error)
    alert('Gagal menyimpan jadwal.')
  }
}

const cancel = () => {
  router.replace('/jadwal')
}
</script>

<style scoped>
ion-item {
  --padding-start: 0;
  margin-bottom: 8px;
}

.form-buttons {
  margin-top: 20px;
}
</style>