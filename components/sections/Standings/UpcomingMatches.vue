<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { data: upcomingMatches, pending, error } = await useFetch('/api/upcoming-matches')

// Función para formatear fecha
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <section class="relative w-full pt-14">
    <!-- Fondo con el logo en opacidad -->
    <div
      class="absolute inset-0 flex justify-center items-center pointer-events-none"
      aria-hidden="true"
    >
      <img
        src="/iconos/adn_color.png"
        alt="ADN Deportivo"
        class="opacity-10 dark:opacity-20"
      />
    </div>

    <div class="relative z-10 p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-center text-black dark:text-white">Próximos Partidos</h1>
      <h3 class="text-xl font-bold mb-4 text-center text-black dark:text-white">Primera C Grupo H</h3>

      <div v-if="pending" class="text-center">Cargando...</div>
      <div v-else-if="error" class="text-center text-red-500">Error al cargar los partidos.</div>
      <div v-else-if="!upcomingMatches || upcomingMatches.length === 0" 
           class="text-center text-gray-500 dark:text-gray-400">
        No hay partidos programados próximamente.
      </div>
      <div v-else>
        <div class="space-y-4">
          <div
            v-for="match in upcomingMatches"
            :key="match.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 p-4"
          >
            <!-- Información del partido -->
            <div class="text-center mb-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Jornada {{ match.round }} • {{ formatDate(match.dateTimeUTC) }}
              </p>
              <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ formatTime(match.dateTimeUTC) }}
              </p>
            </div>

            <!-- Equipos -->
            <div class="flex items-center justify-between">
              <!-- Equipo Local -->
              <div class="flex-1 text-center">
                <div class="flex flex-col items-center">
                  <img
                    :src="`/teams/${match.homeTeam.picture}.png`"
                    :alt="match.homeTeam.name"
                    class="w-12 h-12 object-contain mb-2"
                  />
                  <p class="text-sm font-medium text-black dark:text-white">
                    {{ match.homeTeam.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Local
                  </p>
                </div>
              </div>

              <!-- VS -->
              <div class="px-4">
                <span class="text-xl font-bold text-gray-600 dark:text-gray-400">VS</span>
              </div>

              <!-- Equipo Visitante -->
              <div class="flex-1 text-center">
                <div class="flex flex-col items-center">
                  <img
                    :src="`/teams/${match.awayTeam.picture}.png`"
                    :alt="match.awayTeam.name"
                    class="w-12 h-12 object-contain mb-2"
                  />
                  <p class="text-sm font-medium text-black dark:text-white">
                    {{ match.awayTeam.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Visitante
                  </p>
                </div>
              </div>
            </div>

            <!-- Información del estadio -->
            <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div class="text-center">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ match.facility.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ match.facility.place }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>