<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Tanya AI</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-textarea
        v-model="pertanyaan"
        label="Pertanyaanmu"
        label-placement="floating"
        fill="outline"
        :rows="3"
        :maxlength="500"
        placeholder="Contoh: olahraga apa yang cocok untuk pemula?"
      ></ion-textarea>

      <ion-button
        expand="block"
        class="ion-margin-top"
        :disabled="loading || !pertanyaan.trim()"
        @click="tanya"
      >
        <ion-spinner v-if="loading" name="dots"></ion-spinner>
        <span v-else>Tanya AI</span>
      </ion-button>

      <ion-text v-if="loading" color="medium">
        <p class="ion-text-center">AI sedang berpikir, mohon tunggu...</p>
      </ion-text>

      <ion-text v-if="error" color="danger">
        <p>{{ error }}</p>
      </ion-text>

      <ion-card v-if="jawaban">
        <ion-card-header>
          <ion-card-title>Saran dari SportBuddy AI</ion-card-title>
        </ion-card-header>
        <ion-card-content class="jawaban">{{ jawaban }}</ion-card-content>
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
  IonTextarea,
  IonButton,
  IonSpinner,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue'

import { getSaranAI } from '../services/aiSaran'

const pertanyaan = ref('')
const jawaban = ref('')
const error = ref('')
const loading = ref(false)

const tanya = async () => {
  loading.value = true
  error.value = ''
  jawaban.value = ''

  try {
    jawaban.value = await getSaranAI(pertanyaan.value.trim())
  } catch (e) {
    console.error(e)
    error.value = 'Terjadi kesalahan saat memproses pertanyaan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.jawaban {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>