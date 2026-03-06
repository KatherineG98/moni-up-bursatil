import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * Infraestructura de conexión a Firebase.
 * Construye el objeto de configuración base inyectando las credenciales localizadas
 * de manera estática mediante las variables de entorno de Vite en compilación.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  firebaseConfig.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

/**
 * Rutina estricta de validación en tiempo de ejecución.
 * Detiene implícitamente la inicialización estable de datos si falta el conjunto crítico.
 */
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
]

requiredVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    console.error(`❌ Fallo de aserción del entorno: Falta la constante ${varName}`)
  }
})

// Inicializa la instancia Singleton global de Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)

// Analytics
let analytics = null
if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  import('firebase/analytics')
    .then(({ getAnalytics, isSupported }) => {
      isSupported().then((yes) => {
        if (yes) {
          analytics = getAnalytics(app)

        }
      })
    })
    .catch(() => {

    })
}

export { analytics }
export default app
