<template>
  <section class="py-10">
    <h2 class="text-2xl font-bold mb-6 text-center text-black dark:text-white">
      Tarjetas y Sanciones
    </h2>

    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
      <div
        v-for="(equipo, nombreEquipo) in tarjetas"
        :key="nombreEquipo"
        class="bg-white rounded-md shadow p-3 border-t-4"
        :class="{
          'border-yellow-400': tieneTarjetaAmarilla(equipo.jugadores),
          'border-red-500': tieneTarjetaRoja(equipo.jugadores)
        }"
      >
        <div class="flex flex-col items-center text-center">
          <img
            :src="`/${equipo.team_picture}`"
            :alt="`Logo de ${nombreEquipo}`"
            class="w-12 h-12 object-contain mb-2"
          />
          <h3 class="font-semibold text-lg mb-3">{{ nombreEquipo }}</h3>

          <ul class="w-full">
            <li
              v-for="jugador in equipo.jugadores"
              :key="jugador.nombre"
              class="flex flex-col items-center bg-yellow-50 px-4 py-2 rounded mb-2"
              :class="{
                'bg-yellow-50': jugador.tipo === 'amarilla',
                'bg-red-100': jugador.tipo === 'roja'
              }"
            >
              <p class="font-semibold text-gray-800">{{ jugador.nombre }}</p>
              <div class="flex items-center justify-center gap-2 text-xs mb-1">
                <span
                  class="inline-block w-3 h-5 rounded-sm"
                  :class="{
                    'bg-yellow-400': jugador.tipo === 'amarilla',
                    'bg-red-500': jugador.tipo === 'roja'
                  }"
                ></span>
                <span class="capitalize text-gray-700">{{ jugador.tipo }}</span>
              </div>
              <div
                v-if="jugador.suspendidoHasta"
                class="text-xs text-red-600 font-semibold"
              >
                Suspendido hasta: {{ jugador.suspendidoHasta }}
              </div>
              <div
                v-else
                class="text-xs text-green-600 font-medium"
              >
                Disponible
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  tarjetas: {
    type: Object,
    required: true
  }
})

// Funciones para detectar si hay tarjeta amarilla o roja en el equipo (para borde)
const tieneTarjetaAmarilla = (jugadores) =>
  jugadores.some(j => j.tipo === "amarilla")

const tieneTarjetaRoja = (jugadores) =>
  jugadores.some(j => j.tipo === "roja")
</script>
