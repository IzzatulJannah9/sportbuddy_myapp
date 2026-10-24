<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="goToHome">
            ←
          </ion-button>
        </ion-buttons>

        <ion-title>Workout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- TITLE -->
      <div class="page-header">
        <h1>My Workout 🏋️</h1>

        <p>
          Catat dan kelola latihanmu
        </p>
      </div>

      <!-- ADD BUTTON -->
      <div class="add-container">

        <ion-button
          expand="block"
          color="primary"
          class="add-button"
          @click="openForm"
        >
          <ion-icon
            slot="start"
            :icon="addOutline"
          />

          Tambah Latihan
        </ion-button>

      </div>

      <!-- FORM -->
      <div
        v-if="showForm"
        class="form-card"
      >

        <h2>
          {{ editingId ? 'Edit Latihan' : 'Latihan Baru' }}
        </h2>

        <!-- NAMA -->
        <ion-item>
          <ion-label position="stacked">
            Nama Latihan
          </ion-label>

          <ion-input
            v-model="form.name"
            placeholder="Contoh: Morning Run"
          />
        </ion-item>

        <!-- OLAHRAGA -->
        <ion-item>
          <ion-label position="stacked">
            Jenis Olahraga
          </ion-label>

          <ion-select
            v-model="form.sport"
            placeholder="Pilih olahraga"
          >

            <ion-select-option value="Running">
              Running
            </ion-select-option>

            <ion-select-option value="Cycling">
              Cycling
            </ion-select-option>

            <ion-select-option value="Gym">
              Gym
            </ion-select-option>

            <ion-select-option value="Swimming">
              Swimming
            </ion-select-option>

            <ion-select-option value="Walking">
              Walking
            </ion-select-option>

            <ion-select-option value="Other">
              Other
            </ion-select-option>

          </ion-select>
        </ion-item>

        <!-- DURASI -->
        <ion-item>
          <ion-label position="stacked">
            Durasi (menit)
          </ion-label>

          <ion-input
            v-model.number="form.duration"
            type="number"
            placeholder="30"
          />
        </ion-item>

        <!-- KALORI -->
        <ion-item>
          <ion-label position="stacked">
            Kalori
          </ion-label>

          <ion-input
            v-model.number="form.calories"
            type="number"
            placeholder="200"
          />
        </ion-item>

        <!-- BUTTON -->
        <div class="form-buttons">

          <ion-button
            expand="block"
            color="primary"
            @click="save"
          >
            {{ editingId ? 'Update Latihan' : 'Simpan Latihan' }}
          </ion-button>

          <ion-button
            expand="block"
            color="primary"
            fill="outline"
            @click="cancelForm"
          >
            Batal
          </ion-button>

        </div>

      </div>

      <!-- LIST -->
      <div class="workout-section">

        <h2>
          Riwayat Latihan
        </h2>

        <!-- EMPTY -->
        <div
          v-if="workouts.length === 0"
          class="empty"
        >
          <div class="empty-icon">
            🏃
          </div>

          <h3>
            Belum ada latihan
          </h3>

          <p>
            Yuk tambahkan latihan pertamamu!
          </p>
        </div>

        <!-- WORKOUT LIST -->
        <div
          v-for="workout in workouts"
          :key="workout.id"
          class="workout-card"
        >

          <div class="workout-icon">
            {{ getIcon(workout.sport) }}
          </div>

          <div class="workout-info">

            <h3>
              {{ workout.name }}
            </h3>

            <p>
              {{ workout.sport }}
            </p>

            <div class="details">

              <span>
                ⏱ {{ workout.duration }} menit
              </span>

              <span>
                🔥 {{ workout.calories }} kcal
              </span>

            </div>

            <small>
              {{ formatDate(workout.date) }}
            </small>

          </div>

          <div class="actions">

            <button
              class="edit"
              @click="editWorkout(workout)"
            >
              ✏️
            </button>

            <button
              class="delete"
              @click="removeWorkout(workout.id)"
            >
              🗑️
            </button>

          </div>

        </div>

      </div>

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/vue'

import { addOutline } from 'ionicons/icons'

import {
  getWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  type Workout
} from '../database/workoutRepository'

const workouts = ref<Workout[]>([])

const showForm = ref(false)

const editingId = ref<number | null>(null)

const form = ref({
  name: '',
  sport: '',
  duration: 0,
  calories: 0
})

const router = useRouter()

const goToHome = () => {
  router.push({ name: 'Home' })
}

/* LOAD DATA */

const loadWorkouts = async () => {
  workouts.value = await getWorkouts()
}

/* OPEN FORM */

const openForm = () => {

  editingId.value = null

  form.value = {
    name: '',
    sport: '',
    duration: 0,
    calories: 0
  }

  showForm.value = true
}

/* SAVE */

const save = async () => {

  if (
    !form.value.name ||
    !form.value.sport ||
    !form.value.duration
  ) {

    alert('Nama, olahraga, dan durasi wajib diisi.')

    return
  }

  try {
    const savedAt = new Date().toISOString()

    if (editingId.value) {

      await updateWorkout(
        editingId.value,
        form.value.name,
        form.value.sport,
        savedAt,
        Number(form.value.duration),
        Number(form.value.calories),
        ''
      )

    } else {

      await addWorkout(
        form.value.name,
        form.value.sport,
        savedAt,
        Number(form.value.duration),
        Number(form.value.calories),
        ''
      )

    }

    await loadWorkouts()

    showForm.value = false

    editingId.value = null

  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Terjadi kesalahan saat menyimpan latihan.'

    alert(`Gagal menyimpan latihan: ${message}`)
    console.error('Save workout failed:', error)
  }

}

/* EDIT */

const editWorkout = (workout: Workout) => {

  editingId.value = workout.id

  form.value = {
    name: workout.name,
    sport: workout.sport,
    duration: workout.duration,
    calories: workout.calories
  }

  showForm.value = true

}

/* DELETE */

const removeWorkout = async (id: number) => {

  const confirmDelete = confirm(
    'Apakah kamu yakin ingin menghapus latihan ini?'
  )

  if (!confirmDelete) {
    return
  }

  await deleteWorkout(id)

  await loadWorkouts()

}

/* CANCEL */

const cancelForm = () => {

  showForm.value = false

  editingId.value = null

}

/* ICON */

const getIcon = (sport: string) => {

  switch (sport) {

    case 'Running':
      return '🏃'

    case 'Cycling':
      return '🚴'

    case 'Gym':
      return '🏋️'

    case 'Swimming':
      return '🏊'

    case 'Walking':
      return '🚶'

    default:
      return '💪'

  }

}

/* DATE */

const formatDate = (date: string) => {

  return new Date(date).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  )

}

onMounted(async () => {
  await loadWorkouts()
})

</script>

<style scoped>

.page-header {
  padding: 25px 20px 10px;
}

.page-header h1 {
  margin: 0;

  font-size: 27px;
  font-weight: 800;

  color: var(--ion-color-primary-shade);
}

.page-header p {
  margin-top: 7px;

  color: #8d9993;

  font-size: 13px;
}

.add-container {
  padding: 10px 20px;
}

.add-button {
  --background: var(--ion-color-primary);
  --border-radius: 15px;

  height: 50px;

  font-weight: 700;
}

.form-card {
  margin: 15px 20px;

  padding: 20px;

  border-radius: 22px;

  background: white;

  box-shadow:
    0 8px 30px rgba(0,0,0,0.07);
}

.form-card h2 {
  margin-top: 0;

  color: #2b2f36;
}

ion-item {
  --padding-start: 0;

  margin-bottom: 8px;
}

.form-buttons {
  margin-top: 20px;
}

.workout-section {
  padding: 15px 20px 30px;
}

.workout-section > h2 {
  font-size: 19px;

  color: #2b2f36;
}

.empty {
  text-align: center;

  padding: 50px 20px;

  color: #8e9993;
}

.empty-icon {
  font-size: 55px;
}

.empty h3 {
  color: #3d434b;
}

.empty p {
  font-size: 13px;
}

.workout-card {
  display: flex;

  align-items: center;

  gap: 13px;

  padding: 17px;

  margin-bottom: 13px;

  background: white;

  border-radius: 20px;

  box-shadow:
    0 5px 20px rgba(0,0,0,0.06);
}

.workout-icon {
  width: 52px;
  height: 52px;

  flex-shrink: 0;

  display: flex;

  justify-content: center;
  align-items: center;

  border-radius: 16px;

  background: rgba(var(--ion-color-primary-rgb), 0.1);

  font-size: 25px;
}

.workout-info {
  flex: 1;
}

.workout-info h3 {
  margin: 0 0 5px;

  font-size: 15px;

  color: #2b2f36;
}

.workout-info p {
  margin: 0 0 7px;

  color: var(--ion-color-primary);

  font-size: 12px;
}

.details {
  display: flex;

  gap: 10px;

  color: #7d8782;

  font-size: 10px;
}

.workout-info small {
  display: block;

  margin-top: 7px;

  color: #a3aaa6;

  font-size: 9px;
}

.actions {
  display: flex;

  flex-direction: column;

  gap: 7px;
}

.actions button {
  width: 34px;
  height: 34px;

  border: none;

  border-radius: 10px;

  cursor: pointer;
}

.edit {
  background: #fff3d9;
}

.delete {
  background: #ffe7e7;
}

</style>