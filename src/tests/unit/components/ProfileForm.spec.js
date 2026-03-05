/* global File */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import { useAuthStore } from '@/stores/auth'

// --- Mocks Globales ---
vi.mock('firebase/auth', () => ({
  updateProfile: vi.fn(() => Promise.resolve()),
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('@/services/firebase', () => ({
  auth: { currentUser: { uid: '123' } },
}))

vi.mock('@/utils/sweetalert', () => ({
  showToast: vi.fn(),
}))

vi.mock('@tabler/icons-vue', () => ({
  IconUser: { template: '<span>IconUser</span>' },
  IconCamera: { template: '<span>IconCamera</span>' },
  IconCheck: { template: '<span>IconCheck</span>' },
}))

vi.mock('@/services/storage.service', () => ({
  localStore: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
  },
}))

describe('ProfileForm.vue Component Test', () => {
  let pinia

  beforeEach(() => {
    // Resetear Pinia antes de cada test para no cruzar estados
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('1. Renderiza correctamente el nombre y correo del Store', () => {
    const authStore = useAuthStore()
    // Simulamos que el usuario está logueado
    authStore.user = { displayName: 'Usuario Pruebas', email: 'prueba@moni.com' }

    const wrapper = mount(ProfileForm, {
      global: { plugins: [pinia] },
    })

    // El input de displayName deberia tomar el valor inicial
    const nameInput = wrapper.find('input[type="text"]')
    expect(nameInput.element.value).toBe('Usuario Pruebas')

    // El correo debería mostrarse en el DOM
    expect(wrapper.html()).toContain('prueba@moni.com')
  })

  it('2. Bloquea la subida de avatares maliciosos (SVG/XSS)', async () => {
    const authStore = useAuthStore()
    authStore.user = { displayName: 'Kathe', email: 'kathe@test.com' }

    const wrapper = mount(ProfileForm, {
      global: { plugins: [pinia] },
    })

    // Buscamos el input de archivos
    const fileInput = wrapper.find('input[type="file"]')

    // Creamos un archivo falso simulando un SVG inyectado
    const file = new File(['<svg><script>alert(1)</script></svg>'], 'ataque.svg', {
      type: 'image/svg+xml',
    })

    // Método para inyectar archivos en jsdom y test-utils
    Object.defineProperty(fileInput.element, 'files', {
      value: [file],
    })

    await fileInput.trigger('change')

    // Verificamos que se triggereó el error del SweetAlert
    const { showToast } = await import('@/utils/sweetalert')
    expect(showToast).toHaveBeenCalledWith(
      'error',
      'Formato no válido. Sube solo imágenes (JPG, PNG).'
    )
  })

  it('3. Habilita el botón de guardar SÓLO cuando hay cambios reales', async () => {
    const authStore = useAuthStore()
    authStore.user = { displayName: 'Nombre Original', email: 'test@moni.com' }

    const wrapper = mount(ProfileForm, {
      global: { plugins: [pinia] },
    })

    const btnGuardar = wrapper.find('button.btn-primary')
    const nameInput = wrapper.find('input[type="text"]')

    // Inicialmente el botón DEBE estar deshabilitado porque no hemos escrito nada distinto
    expect(btnGuardar.element.disabled).toBe(true)

    // Escribimos un nombre nuevo
    await nameInput.setValue('Nombre Modificado')

    // Ahora debería habilitarse el botón
    expect(btnGuardar.element.disabled).toBe(false)
  })
})
