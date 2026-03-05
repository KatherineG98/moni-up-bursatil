<script setup></script>

<template>
  <div id="billetera-virtual" class="bg-base-100 py-20 px-6 border-t border-base-200">
    <div class="flex flex-col md:flex-row items-center gap-12 justify-between">
      <!-- Contenido de texto y CTA -->
      <div class="md:w-1/2 space-y-6">
        <div class="badge badge-primary badge-outline text-sm px-4 py-3 font-semibold">
          Tu Billetera Virtual
        </div>
        <h2 class="text-4xl md:text-5xl font-black leading-tight">
          Control total sobre<br /><span class="text-primary">Tus Inversiones</span>
        </h2>
        <p class="text-lg text-base-content/70 leading-relaxed">
          Inicia tu viaje financiero con 10,000 USD virtuales. Monitorea tu balance, revisa el
          historial de transacciones y toma decisiones basadas en datos del mercado actual.
        </p>
        <div class="pt-4">
          <router-link
            :to="{ name: 'register' }"
            class="btn btn-primary btn-lg rounded-lg px-8 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
          >
            Abre tu cuenta gratis
          </router-link>
        </div>
      </div>
      <!-- Contenedor visual decorativo -->
      <div class="md:w-1/2 flex justify-center md:justify-end">
        <div
          class="w-82 h-82 md:w-120 md:h-100 bg-linear-to-tr from-primary/8 to-secondary/20 rounded-4xl rotate-2 flex items-center justify-center shadow-inner relative overflow-hidden"
        >
          <img
            src="@/assets/account-balance-wallet-0.svg"
            alt="Billetera"
            class="w-60 h-60 object-contain drop-shadow-2xl z-10 -rotate-3 transition-transform hover:scale-110 duration-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>
