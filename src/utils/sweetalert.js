import Swal from 'sweetalert2'

/**
 * Configuración de SweetAlert2 para DaisyUI/Tailwind
 */
/**
 * CSS Base Classes for DaisyUI
 * Usamos !bg-base-100 para forzar el fondo sólido del tema
 */
const BASE_CLASSES = {
  popup:
    'rounded-2xl border border-base-300 !bg-base-100 text-base-content shadow-2xl !p-6 !pb-12 !border-t-4 !border-t-primary',
  title: 'text-xl font-black tracking-tight mt-4 text-base-content',
  htmlContainer: 'text-sm opacity-70 mt-2 text-base-content',
  confirmButton: 'btn btn-primary rounded-xl px-10 font-bold shadow-lg h-10 min-h-0 mx-2',
  cancelButton: 'btn btn-ghost rounded-xl px-10 h-10 min-h-0 mx-2',
  denyButton: 'btn btn-error rounded-xl px-10 h-10 min-h-0 mx-2',
  input:
    'input input-bordered w-full rounded-xl mt-4 focus:outline-none focus:border-primary bg-base-200 text-base-content',
  actions: 'mt-8 w-full flex justify-center',
  loader: 'loading loading-spinner text-primary',
}

const DEFAULT_OPTIONS = {
  background: 'hsl(var(--b1) / 1)', // Forzamos fondo sólido basado en el tema
  color: 'hsl(var(--bc) / 1)', // Color de texto basado en el tema
  buttonsStyling: false,
}

/**
 * Alerta estándar (Success, Error, Info, Warning)
 */
export const showAlert = (options) => {
  return Swal.fire({
    ...DEFAULT_OPTIONS,
    customClass: BASE_CLASSES,
    width: '24rem',
    backdrop: 'rgba(0,0,0,0.6)',
    ...options,
  })
}

/**
 * Notificación tipo Toast
 */
export const showToast = (icon = 'success', title = '') => {
  return Swal.fire({
    ...DEFAULT_OPTIONS,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    width: 'auto',
    backdrop: false, // CRÍTICO: No overlay para toasts
    customClass: {
      ...BASE_CLASSES,
      popup:
        'rounded-xl shadow-xl text-sm font-medium border border-base-300 !bg-base-100 !p-4 !pb-4 !border-t-0',
      title: 'text-sm font-bold m-0 p-0 text-base-content',
      htmlContainer: 'text-xs opacity-70 m-0 p-0 text-base-content',
    },
    icon,
    title,
  })
}

/**
 * Diálogo de confirmación
 */
export const showConfirm = (title, text, confirmButtonText = 'Confirmar', icon = 'question') => {
  return showAlert({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
  })
}

export default {
  alert: showAlert,
  toast: showToast,
  confirm: showConfirm,
}
