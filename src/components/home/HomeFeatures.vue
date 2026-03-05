<script setup></script>

<template>
  <section class="px-6 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto">
      <!-- Tarjeta Principal (Izquierda) -->
      <div
        class="card bg-linear-to-br from-base-100 via-secondary/5 to-secondary/10 shadow-sm hover:shadow-[0_15px_30px_rgba(236,72,153,0.1)] border border-secondary/10 rounded-3xl group overflow-hidden transition-all duration-500"
      >
        <div class="card-body p-10 justify-between relative z-10">
          <div class="space-y-4">
            <h2 class="text-3xl font-black leading-tight">Datos Reales</h2>
            <p class="text-base-content/70 text-left leading-relaxed text-lg">
              Conexión directa con APIs de mercado para obtener precios de Bitcoin y criptomonedas
              en tiempo real.
            </p>
          </div>
          <div class="flex justify-center items-center py-6">
            <img
              src="@/assets/query-stats-1.svg"
              alt="Estadísticas"
              class="w-56 h-56 md:w-64 md:h-64 object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-[0_15px_30px_rgba(236,72,153,0.15)]"
            />
          </div>
        </div>
      </div>

      <!-- Tarjetas Secundarias (Derecha) -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Gestión de activos -->
        <div
          class="card bg-linear-to-br from-base-100 via-primary/5 to-primary/10 shadow-sm hover:shadow-[0_15px_30px_rgba(168,85,247,0.1)] border border-primary/10 rounded-3xl group overflow-hidden transition-all duration-500"
        >
          <div class="card-body p-8 flex-col justify-between">
            <div class="flex justify-end p-4">
              <img
                src="@/assets/cases-2.svg"
                alt="Portafolio"
                class="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-[0_10px_20px_rgba(168,85,247,0.1)]"
              />
            </div>
            <div class="space-y-3">
              <h2 class="card-title text-2xl font-black text-base-content">
                Gestión de Portafolio
              </h2>
              <p class="text-base-content/70 text-left leading-relaxed">
                Administra tus activos digitales de manera eficiente y segura con herramientas de
                análisis avanzadas.
              </p>
            </div>
          </div>
        </div>

        <!-- Simulación sin riesgo -->
        <div
          class="card bg-linear-to-br from-base-100 via-secondary/5 to-secondary/10 shadow-sm hover:shadow-[0_15px_30px_rgba(236,72,153,0.1)] border border-secondary/10 rounded-3xl group overflow-hidden transition-all duration-500"
        >
          <div class="card-body p-8 flex-col justify-between">
            <div class="flex justify-end p-4">
              <img
                src="@/assets/bar-chart-4-bars-3.svg"
                alt="Gráficos"
                class="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-[0_10px_20px_rgba(236,72,153,0.1)]"
              />
            </div>
            <div class="space-y-3">
              <h2 class="card-title text-2xl font-black text-base-content">Simulación Zero-Risk</h2>
              <p class="text-base-content/70 text-left leading-relaxed">
                Opera con dinero virtual y perfecciona tus estrategias de trading antes de saltar al
                mercado real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
