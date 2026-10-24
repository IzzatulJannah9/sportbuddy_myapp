import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader'

import { initDatabase } from './database/database'

import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import './theme/variables.css'

// Daftarkan custom element jeep-sqlite (hanya dipakai di web)
jeepSqlite(window)

const app = createApp(App)

app.use(IonicVue)
app.use(router)

const start = async () => {
  await router.isReady()

  // Di browser, elemen <jeep-sqlite> harus ada SEBELUM database diinisialisasi
  if (Capacitor.getPlatform() === 'web') {
    const jeepEl = document.createElement('jeep-sqlite')
    document.body.appendChild(jeepEl)
    await customElements.whenDefined('jeep-sqlite')
  }

  app.mount('#app')

  initDatabase()
    .then(() => {
      console.log('✅ Database siap digunakan')
    })
    .catch((error) => {
      console.error('❌ Database gagal:', error)
    })
}

start()