import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Mock de Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn((auth, email, password) => {
    if (password.length >= 8) {
      return Promise.resolve({ user: { email, displayName: '' } })
    }
    return Promise.reject(new Error('Password too short'))
  }),
  signInWithEmailAndPassword: vi.fn((auth, email, password) => {
    if (email === 'test@moni.com' && password === 'secreta123') {
      return Promise.resolve({ user: { email, displayName: 'Test User' } })
    }
    return Promise.reject(new Error('Invalid credentials'))
  }),
  updateProfile: vi.fn((user, { displayName }) => {
    user.displayName = displayName
    return Promise.resolve()
  }),
  signOut: vi.fn(() => Promise.resolve()),
  onAuthStateChanged: vi.fn((auth, cb) => {
    // Simula inicialización vacía inicial
    cb(null)
    return vi.fn()
  }),
  EmailAuthProvider: { credential: vi.fn() },
  reauthenticateWithCredential: vi.fn(() => Promise.resolve()),
  updatePassword: vi.fn(() => Promise.resolve()),
  deleteUser: vi.fn(() => Promise.resolve()),
}))

// Mock de Firebase App
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}))

// Mock de Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
}))

// Mock services
vi.mock('@/services/storage.service', () => ({
  localStore: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}))

describe('Auth Store Integration Lifecycle', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('1. Registro exitoso de usuario nuevo', async () => {
    const authStore = useAuthStore()

    expect(authStore.isAuthenticated).toBe(false)

    // Testeamos registro
    const res = await authStore.register('new@moni.com', 'secreta123', 'Nuevo User')

    expect(res.success).toBe(true)
    expect(authStore.userEmail).toBe('new@moni.com')
    // El mock inicial no muta el ref de forma compleja, pero comprobemos datos devueltos
    expect(res.user.email).toBe('new@moni.com')
  })

  it('2. Registro fallido por password corta', async () => {
    const authStore = useAuthStore()

    // Tratamos con password de 6 caracteres (ahora el limite es 8)
    const res = await authStore.register('fail@moni.com', '123456')
    expect(res.success).toBe(false)
    expect(res.error).toContain('La contraseña debe tener al menos 8 caracteres')
  })

  it('3. Login exitoso de usuario existente', async () => {
    const authStore = useAuthStore()

    const res = await authStore.login('test@moni.com', 'secreta123')
    expect(res.success).toBe(true)
    expect(authStore.userEmail).toBe('test@moni.com')
  })

  it('4. Cierre de sesión (Logout)', async () => {
    const authStore = useAuthStore()

    // Pre-logueamos al mock
    await authStore.login('test@moni.com', 'secreta123')
    expect(authStore.isAuthenticated).toBe(true)

    // Hacemos el logout
    await authStore.logout()

    // El usuario deberia ser nulo
    expect(authStore.user).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
  })
})
