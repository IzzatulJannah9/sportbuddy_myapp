import { Capacitor } from '@capacitor/core'

// Browser: localhost. Emulator Android: 10.0.2.2.
// HP asli: ganti dengan IP laptop, contoh 'http://192.168.1.10:3000'
export const api_URL =
  Capacitor.getPlatform() === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000'