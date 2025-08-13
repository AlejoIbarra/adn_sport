<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { data: allMatches, pending, error } = await useFetch('/api/all-matches')

// Estado para la jornada seleccionada
const selectedRound = ref<string>('')
const availableRounds = ref<string[]>([])

// Función para obtener la jornada actual (la más reciente con partidos jugados o la próxima)
const getCurrentRound = () => {
  if (!allMatches.value) return ''
  
  // Buscar la última jornada con partidos jugados
  const playedRounds = new Set<string>()
  const scheduledRounds = new Set<string>()
  
  allMatches.value.forEach(match => {
    if (match.liveStatus === 'PLAYED') {
      playedRounds.add(match.round)
    } else if (match.liveStatus === 'SCHEDULED') {
      scheduledRounds.add(match.round)
    }
  })
  
  // Si hay jornadas jugadas, tomar la más alta
  if (playedRounds.size > 0) {
    const maxPlayedRound = Math.max(...Array.from(playedRounds).map(r => parseInt(r)))
    return maxPlayedRound.toString()
  }
  
  // Si no hay jugadas, tomar la primera programada
  if (scheduledRounds.size > 0) {
    const minScheduledRound = Math.min(...Array.from(scheduledRounds).map(r => parseInt(r)))
    return minScheduledRound.toString()
  }
  
  return ''
}

// Función para obtener jornadas disponibles
const getAvailableRounds = () => {
  if (!allMatches.value) return []
  
  const rounds = new Set<string>()
  
  allMatches.value.forEach(match => {
    rounds.add(match.round)
  })
  
  return Array.from(rounds).sort((a, b) => parseInt(a) - parseInt(b))
}

// Partidos filtrados por jornada seleccionada
const filteredMatches = computed(() => {
  if (!allMatches.value || !selectedRound.value) return []
  
  return allMatches.value
    .filter(match => match.round === selectedRound.value)
    .sort((a, b) => a.dateTimeUTC - b.dateTimeUTC)
})

// Estadísticas de la jornada
const roundStats = computed(() => {
  if (!filteredMatches.value.length) return { played: 0, scheduled: 0, total: 0 }
  
  const played = filteredMatches.value.filter(m => m.liveStatus === 'PLAYED').length
  const scheduled = filteredMatches.value.filter(m => m.liveStatus === 'SCHEDULED').length
  
  return {
    played,
    scheduled,
    total: filteredMatches.value.length
  }
})

// Función para formatear fecha
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

// Función para formatear hora
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Inicializar cuando se carguen los datos
onMounted(() => {
  if (allMatches.value) {
    availableRounds.value = getAvailableRounds()
    selectedRound.value = getCurrentRound()
  }
})

// Navegación entre jornadas
const goToPreviousRound = () => {
  const currentIndex = availableRounds.value.indexOf(selectedRound.value)
  if (currentIndex > 0) {
    selectedRound.value = availableRounds.value[currentIndex - 1]
  }
}

const goToNextRound = () => {
  const currentIndex = availableRounds.value.indexOf(selectedRound.value)
  if (currentIndex < availableRounds.value.length - 1) {
    selectedRound.value = availableRounds.value[currentIndex + 1]
  }
}

const canGoNext = computed(() => {
  const currentIndex = availableRounds.value.indexOf(selectedRound.value)
  return currentIndex < availableRounds.value.length - 1
})

const canGoPrevious = computed(() => {
  const currentIndex = availableRounds.value.indexOf(selectedRound.value)
  return currentIndex > 0
})
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

    <div class="relative z-10 pb-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-center text-black dark:text-white">Partidos por Jornada</h1>
      <h3 class="text-xl font-bold mb-6 text-center text-black dark:text-white">Primera C Grupo H</h3>

      <div v-if="pending" class="text-center">Cargando...</div>
      <div v-else-if="error" class="text-center text-red-500">Error al cargar los partidos.</div>
      <div v-else-if="!allMatches || allMatches.length === 0" 
           class="text-center text-gray-500 dark:text-gray-400">
        No hay partidos disponibles.
      </div>
      <div v-else>
        <!-- Navegador de jornadas -->
        <div class="mb-6">
          <!-- Controles de navegación -->
          <div class="flex items-center justify-between mb-4">
            <button
              @click="goToPreviousRound"
              :disabled="!canGoPrevious"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div class="text-center">
              <p class="text-2xl font-bold text-black dark:text-white">
                Jornada {{ selectedRound }}
              </p>
              <div class="flex gap-4 text-sm text-gray-600 dark:text-gray-400 justify-center mt-1">
                <span class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  {{ roundStats.played }} Jugados
                </span>
                <span class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {{ roundStats.scheduled }} Programados
                </span>
              </div>
            </div>

            <button
              @click="goToNextRound"
              :disabled="!canGoNext"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Proxima Fecha
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Selector de jornada (alternativo) -->
          <div class="text-center">
            <select
              v-model="selectedRound"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="">Selecciona una jornada</option>
              <option v-for="round in availableRounds" :key="round" :value="round">
                Jornada {{ round }}
              </option>
            </select>
          </div>
        </div>

        <!-- Lista de partidos -->
        <div v-if="selectedRound && filteredMatches.length === 0" 
             class="text-center text-gray-500 dark:text-gray-400 py-8">
          No hay partidos para esta jornada.
        </div>

        <div v-else class="space-y-1">
          <div
            v-for="match in filteredMatches"
            :key="match.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 p-1"
          >
            <!-- Información del partido -->
            <div class="text-center mb-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(match.dateTimeUTC) }} • {{ formatTime(match.dateTimeUTC) }}
              </p>
              <p v-if="match.liveStatus === 'PLAYED'" 
                 class="text-xs text-green-600 dark:text-green-400 font-medium">
                FINALIZADO
              </p>
              <p v-else-if="match.liveStatus === 'SCHEDULED'" 
                 class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                PROGRAMADO
              </p>
              <p v-else 
                 class="text-xs text-orange-600 dark:text-orange-400 font-medium">
                {{ match.liveStatus }}
              </p>
            </div>

            <!-- Equipos y resultado -->
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

              <!-- Resultado o VS -->
              <div class="px-4 text-center">
                <div v-if="match.liveStatus === 'PLAYED'" 
                     class="bg-gray-100 dark:bg-gray-700 rounded-lg py-2 px-4">
                  <p class="text-2xl font-bold text-black dark:text-white">
                    {{ match.homeTeamResult.current }} - {{ match.awayTeamResult.current }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">FT</p>
                </div>
                <div v-else class="bg-blue-100 dark:bg-blue-900 rounded-lg py-2 px-4">
                  <p class="text-xl font-bold text-blue-600 dark:text-blue-400">VS</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ formatTime(match.dateTimeUTC) }}
                  </p>
                </div>
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

        <!-- Resumen de la jornada -->
        <div v-if="selectedRound && filteredMatches.length > 0" class="mt-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 class="text-lg font-semibold text-center text-black dark:text-white mb-3">
              Resumen Jornada {{ selectedRound }}
            </h4>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ roundStats.played }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Jugados</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ roundStats.scheduled }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Programados</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {{ roundStats.total }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>