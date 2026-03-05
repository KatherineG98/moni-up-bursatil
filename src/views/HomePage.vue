<script setup>
import HomeHero from '@/components/home/HomeHero.vue'
import HomeFeatures from '@/components/home/HomeFeatures.vue'
import HomeCta from '@/components/home/HomeCta.vue'
</script>

<template>
  <div
    class="min-h-screen bg-base-100 selection:bg-primary/20 selection:text-primary font-sans leading-normal overflow-x-hidden"
  >
    <!-- Sección Hero interactiva -->
    <HomeHero />

    <!-- Contenedor para el resto de secciones -->
    <div class="max-w-[1160px] mx-auto relative">
      <!-- Sección Bento Grid -->
      <HomeFeatures />

      <!-- Sección Final: Billetera Virtual y Cierre de CTA -->
      <HomeCta />
    </div>
  </div>
</template>
