<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  IconCoinBitcoin,
  IconCurrencyEthereum,
  IconBrandApple,
  IconBrandGoogle,
  IconBrandMeta,
  IconCurrencySolana,
} from '@tabler/icons-vue'

const authStore = useAuthStore()

// Lógica para el cálculo de proximidad de los elementos flotantes
const heroRef = ref(null)
const mouse = reactive({ x: 0, y: 0 })

// Definición de logos usando componentes de Tabler
const floatingItems = reactive([
  // Lado Izquierdo
  {
    id: 'btc',
    name: 'BTC',
    color: '#F7931A',
    x: -35,
    y: -25,
    scale: 1.1,
    icon: IconCoinBitcoin,
    offsetX: ref(0),
    offsetY: ref(0),
  },
  {
    id: 'aapl',
    name: 'Apple',
    color: '#1A1A1A',
    x: -25,
    y: 15,
    scale: 0.85,
    icon: IconBrandApple,
    offsetX: ref(0),
    offsetY: ref(0),
  },
  {
    id: 'meta',
    name: 'Meta',
    color: '#0668E1',
    x: -45,
    y: 0,
    scale: 1.05,
    icon: IconBrandMeta,
    offsetX: ref(0),
    offsetY: ref(0),
  },

  // Lado Derecho
  {
    id: 'eth',
    name: 'ETH',
    color: '#627EEA',
    x: 35,
    y: -25,
    scale: 1.2,
    icon: IconCurrencyEthereum,
    offsetX: ref(0),
    offsetY: ref(0),
  },
  {
    id: 'goog',
    name: 'Google',
    color: '#4285F4',
    x: 25,
    y: 15,
    scale: 0.8,
    icon: IconBrandGoogle,
    offsetX: ref(0),
    offsetY: ref(0),
  },
  {
    id: 'sol',
    name: 'SOL',
    color: '#14F195',
    x: 45,
    y: 5,
    scale: 0.95,
    icon: IconCurrencySolana,
    offsetX: ref(0),
    offsetY: ref(0),
  },
])

const handleMouseMove = (e) => {
  if (!heroRef.value) return
  const { clientX, clientY } = e
  const rect = heroRef.value.getBoundingClientRect()

  const mx = clientX - rect.left
  const my = clientY - rect.top

  mouse.x = mx
  mouse.y = my

  floatingItems.forEach((item) => {
    const baseX = rect.width / 2 + (item.x * rect.width) / 100
    const baseY = rect.height / 2 + (item.y * rect.height) / 100

    const dx = mx - baseX
    const dy = my - baseY
    const dist = Math.sqrt(dx * dx + dy * dy)

    const radius = 300 // Radio un poco más amplio
    if (dist < radius) {
      const force = (radius - dist) / radius
      const push = force * 35 // Empuje más sutil (antes 60)

      item.offsetX = -(dx / dist) * push
      item.offsetY = -(dy / dist) * push
    } else {
      item.offsetX *= 0.94 // Retorno más suave
      item.offsetY *= 0.94
    }
  })
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <!-- Sección Hero -->
  <div
    ref="heroRef"
    class="relative min-h-[85vh] flex items-center justify-center overflow-visible bg-base-100 pt-28 pb-20"
  >
    <!-- Fondo -->
    <div
      class="absolute inset-0 bg-linear-to-b from-primary/10 via-secondary/5 to-transparent pointer-events-none z-0"
    ></div>

    <!-- Contenedor de iconos flotantes -->
    <div
      class="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-10"
    >
      <div
        v-for="(item, index) in floatingItems"
        :key="item.id"
        class="absolute hidden lg:flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
        :style="{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${item.x}vw + ${item.offsetX}px), calc(-50% + ${item.y}vh + ${item.offsetY}px)) scale(${item.scale})`,
        }"
      >
        <div
          class="glass-logo p-6 rounded-full animate-float flex items-center justify-center group bg-white shadow-xl shadow-base-content/5"
          :style="{ animationDelay: `${index * 0.8}s` }"
        >
          <component
            :is="item.icon"
            class="w-8 h-8 transition-transform duration-500 group-hover:scale-110"
            :style="{ color: item.color }"
            stroke-width="2"
          />
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="relative z-20 max-w-[1160px] mx-auto text-center px-6 pointer-events-none">
      <div class="max-w-4xl mx-auto pointer-events-auto transform translate-y-[-10px]">
        <div class="badge badge-primary badge-outline text-sm px-4 py-3 mb-4 font-semibold">
          $10.000 USD virtuales para practicar
        </div>

        <h1
          class="text-5xl md:text-7xl font-black mb-8 animate-fade-in tracking-tight leading-[1.1] text-base-content"
        >
          Simula tus
          <span class="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary"
            >inversiones</span
          >
          con calma
        </h1>

        <p
          v-sanitize="
            'Domina el mercado de Bitcoin y activos digitales en un entorno seguro y sin estrés, ideal para tus primeros pasos en el mundo bursátil.'
          "
          class="text-lg md:text-xl mb-12 text-base-content/70 leading-relaxed font-medium animate-fade-in delay-200 mx-auto max-w-3xl"
        ></p>

        <!-- Acciones -->
        <div
          class="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in delay-300"
        >
          <template v-if="!authStore.isAuthenticated">
            <router-link
              :to="{ name: 'register' }"
              class="btn btn-primary h-14 min-h-14 px-10 text-lg rounded-lg shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95"
            >
              Comenzar Ahora
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.glass-logo {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-logo:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(236, 72, 153, 0.3);
  box-shadow: 0 20px 60px -15px rgba(236, 72, 153, 0.2);
}

:deep(.dark) .glass-logo {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.4s;
}
</style>
