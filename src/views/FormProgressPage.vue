```vue
<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar color="primary">

        <ion-buttons slot="start">
          <ion-back-button
            default-href="/progress"
          ></ion-back-button>
        </ion-buttons>

        <ion-title>
          {{ isEdit ? 'Edit Progress' : 'Tambah Progress' }}
        </ion-title>

      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content class="ion-padding">

      <ion-list>

    <!-- JENIS OLAHRAGA (dari API) -->
    <ion-item>
      <ion-select
    v-model="form.nama"
    label="Jenis Olahraga"
    label-placement="floating"
  >
    <ion-select-option
      v-for="o in daftarOlahraga"
      :key="o.id"
      :value="o.nama"
    >
      {{ o.emoji }} {{ o.nama }}
    </ion-select-option>
  </ion-select>
</ion-item>
        <!-- TANGGAL -->
        <ion-item>
          <ion-input
            v-model="form.tanggal"
            type="date"
            label="Tanggal"
            label-placement="floating"
          ></ion-input>
        </ion-item>

        <!-- JARAK -->
        <ion-item>
          <ion-input
            v-model.number="form.jarak"
            type="number"
            label="Jarak (km)"
            label-placement="floating"
            placeholder="Contoh: 5"
          ></ion-input>
        </ion-item>

        <!-- DURASI -->
        <ion-item>
          <ion-input
            v-model.number="form.durasi"
            type="number"
            label="Durasi (menit)"
            label-placement="floating"
            placeholder="Contoh: 30"
          ></ion-input>
        </ion-item>

        <!-- KALORI -->
        <ion-item>
          <ion-input
            v-model.number="form.kalori"
            type="number"
            label="Kalori (kcal)"
            label-placement="floating"
            placeholder="Contoh: 300"
          ></ion-input>
        </ion-item>

        <!-- CATATAN -->
        <ion-item>
          <ion-textarea
            v-model="form.catatan"
            label="Catatan"
            label-placement="floating"
            placeholder="Tulis catatan latihan..."
            :auto-grow="true"
          ></ion-textarea>
        </ion-item>

      </ion-list>

      <!-- TOMBOL SIMPAN -->
      <ion-button
        expand="block"
        class="save-button"
        @click="simpanProgress"
      >
        {{ isEdit ? 'Simpan Perubahan' : 'Simpan Progress' }}
      </ion-button>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOlahragaList, type Olahraga } from '../api/olahragaRepository'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonButton,
  alertController,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  getProgressById,
  addProgress,
  updateProgress
} from '../database/Progressrepository'


// ==========================================
// ROUTER
// ==========================================
const router = useRouter()
const route = useRoute()

// ==========================================
// DAFTAR OLAHRAGA (DARI API)
// ==========================================

const daftarOlahraga = ref<Olahraga[]>([])

// ==========================================
// CEK MODE EDIT
// ==========================================

const isEdit = computed(() => {
  return route.name === 'EditProgress'
})


// ==========================================
// ID DATA YANG AKAN DIEDIT
// ==========================================

const progressId = computed(() => {
  const id = Number(route.params.id)

  return Number.isNaN(id) ? null : id
})


// ==========================================
// FORM
// ==========================================

const form = reactive({
  nama: '',
  tanggal: '',
  jarak: 0,
  durasi: 0,
  kalori: 0,
  catatan: ''
})


// ==========================================
// RESET FORM
// ==========================================

const resetForm = () => {

  form.nama = ''
  form.tanggal = ''
  form.jarak = 0
  form.durasi = 0
  form.kalori = 0
  form.catatan = ''

}


// ==========================================
// LOAD DATA UNTUK EDIT
// ==========================================

const loadEditData = async () => {

  if (!isEdit.value) {
    resetForm()
    return
  }

  if (progressId.value === null) {

    const alert = await alertController.create({
      header: 'Data Tidak Valid',
      message: 'ID progress tidak ditemukan.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            router.replace('/progress')
          }
        }
      ]
    })

    await alert.present()

    return
  }


  const data = await getProgressById(progressId.value)


  if (!data) {

    const alert = await alertController.create({
      header: 'Data Tidak Ditemukan',
      message: 'Progress yang ingin diedit tidak ditemukan.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            router.replace('/progress')
          }
        }
      ]
    })

    await alert.present()

    return
  }


  // Masukkan data lama ke form
  form.nama = data.nama
  form.tanggal = data.tanggal
  form.jarak = data.jarak
  form.durasi = data.durasi
  form.kalori = data.kalori
  form.catatan = data.catatan || ''
}


// ==========================================
// LOAD SAAT HALAMAN DIBUKA
// ==========================================

onIonViewWillEnter(async () => {
  try {
    daftarOlahraga.value = await getOlahragaList()
  } catch (e) {
    console.error('Gagal memuat daftar olahraga', e)
  }

  await loadEditData()
})

// ==========================================
// SIMPAN PROGRESS
// ==========================================
const simpanProgress = async () => {

  console.log('1. Tombol diklik', { ...form })

  // Validasi
  if (
    !form.nama ||
    !form.tanggal ||
    form.jarak < 0||
    form.durasi <= 0 ||
    form.kalori <= 0
  ) {

    console.log('2. Validasi gagal')

    const alert = await alertController.create({
      header: 'Data Belum Lengkap',
      message:
        'Silakan isi olahraga, tanggal, durasi, dan kalori dengan benar.',
      buttons: ['OK']
    })

    await alert.present()

    return
  }


  try {

    // ======================================
    // MODE EDIT
    // ======================================

    if (isEdit.value) {

      if (progressId.value === null) {

        const alert = await alertController.create({
          header: 'Gagal',
          message: 'ID progress tidak valid.',
          buttons: ['OK']
        })

        await alert.present()

        return
      }


      await updateProgress(progressId.value, {
        nama: form.nama,
        tanggal: form.tanggal,
        jarak: form.jarak,
        durasi: form.durasi,
        kalori: form.kalori,
        catatan: form.catatan
      })


      const alert = await alertController.create({
        header: 'Berhasil',
        message: 'Progress berhasil diperbarui.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              router.replace('/progress')
            }
          }
        ]
      })

      await alert.present()

    }


    // ======================================
    // MODE TAMBAH
    // ======================================

    else {

      console.log('3. Mau panggil addProgress')

      await addProgress({
        nama: form.nama,
        tanggal: form.tanggal,
        jarak: form.jarak,
        durasi: form.durasi,
        kalori: form.kalori,
        catatan: form.catatan
      })

      console.log('4. addProgress selesai')

      const alert = await alertController.create({
        header: 'Berhasil',
        message: 'Progress berhasil ditambahkan.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              router.replace('/progress')
            }
          }
        ]
      })

      await alert.present()
    }

  } catch (error) {

    console.error('Gagal menyimpan progress:', error)

    const alert = await alertController.create({
      header: 'Gagal',
      message: 'Terjadi kesalahan saat menyimpan progress.',
      buttons: ['OK']
    })

    await alert.present()
  }
}

</script>


<style scoped>

.save-button {
  margin-top: 30px;
}

ion-list {
  margin-top: 10px;
}

</style>
```
