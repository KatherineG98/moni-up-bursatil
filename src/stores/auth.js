import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { localStore } from '@/services/storage.service'
import { sanitizeInput } from '@/utils/sanitize'

export const useAuthStore = defineStore('auth', () => {
  // --- Estado (State) ---
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const userAvatar = ref(localStore.getItem('moniup_avatar', ''))
  const authReady = ref(false)

  /**
   * Prevención de duplicidad en Listeners.
   * Almacena en memoria la promesa generada durante el inicio del observador
   * de estado para evitar registrar múltiples listeners concurrentes a Firebase.
   */
  let _authReadyPromise = null

  // --- Getters ---
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userName = computed(() => user.value?.displayName || user.value?.email?.split('@')[0] || '')

  // --- Acciones (Actions) ---

  /**
   * Inicializa la escucha pasiva del evento `onAuthStateChanged`.
   * Envuelve el callback iterativo de Firebase en una Promesa de única resolución
   * para facilitar la sincronización asíncrona (ej. para retrasar el montaje de la App).
   */
  const initAuthListener = () => {
    if (_authReadyPromise) return _authReadyPromise

    _authReadyPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        loading.value = false
        if (!authReady.value) {
          authReady.value = true
          resolve(firebaseUser)
        }
      })
    })

    return _authReadyPromise
  }

  // Registro de nuevos usuarios
  const register = async (email, password, displayName = '') => {
    loading.value = true
    error.value = null
    try {
      const sanitizedEmail = sanitizeInput(email)
      const sanitizedName = displayName ? sanitizeInput(displayName) : ''

      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres.')
      }

      const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password)

      if (sanitizedName) {
        await updateProfile(userCredential.user, { displayName: sanitizedName })
      }

      user.value = userCredential.user
      return { success: true, user: userCredential.user }
    } catch (err) {
      error.value = err.message
      console.error('Error en registro:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Inicio de sesión
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const sanitizedEmail = sanitizeInput(email)
      const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password)
      user.value = userCredential.user
      return { success: true, user: userCredential.user }
    } catch (err) {
      error.value = err.message
      console.error('Error en login:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Finalización de la sesión
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const listenToAuthChanges = () => {
    initAuthListener()
  }

  return {
    // Estado
    user,
    loading,
    error,
    userAvatar,
    authReady,
    // Getters
    isAuthenticated,
    userEmail,
    userName,
    // Acciones
    initAuthListener,
    register,
    login,
    logout,
    listenToAuthChanges,
  }
})
