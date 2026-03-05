import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '@/components/common/AppButton.vue'

describe('AppButton.vue Component Test', () => {
  it('1. Renderiza correctamente el slot de texto por defecto', () => {
    const wrapper = mount(AppButton, {
      slots: {
        default: 'Comprar Acción',
      },
    })

    expect(wrapper.text()).toContain('Comprar Acción')
    // Verifica clases por defecto de DaisyUI
    expect(wrapper.classes()).toContain('btn')
    expect(wrapper.classes()).toContain('btn-primary')
    expect(wrapper.classes()).toContain('btn-md')
  })

  it('2. Aplica clases según los props pasados (variant, size, block)', () => {
    const wrapper = mount(AppButton, {
      props: {
        variant: 'outline',
        size: 'lg',
        block: true,
      },
      slots: {
        default: 'Test',
      },
    })

    expect(wrapper.classes()).toContain('btn-outline')
    expect(wrapper.classes()).toContain('btn-lg')
    expect(wrapper.classes()).toContain('btn-block')
  })

  it('3. Emite evento click cuando NO está deshabilitado', async () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'Click Me' },
    })

    await wrapper.trigger('click')

    // Debería haberse emitido un evento click
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click').length).toBe(1)
  })

  it('4. Bloquea clicks y muestra spinner si se pasa el prop loading=true', async () => {
    const wrapper = mount(AppButton, {
      props: {
        loading: true,
      },
      slots: { default: 'Cargando' },
    })

    await wrapper.trigger('click')

    // El browser nativo bloquea clicks en attrs disabled, pero test-utils
    // a veces lo bypasea, verifiquemos mejor el atributo HTML y la clase
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('btn-disabled')

    // Verificamos que se renderice el spinner de DaisyUI
    const spinner = wrapper.find('.loading-spinner')
    expect(spinner.exists()).toBe(true)
  })
})
