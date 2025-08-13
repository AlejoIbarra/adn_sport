<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { data: playedMatches, pending, error } = await useFetch('/api/played-matches')

// Estado para la fecha seleccionada
const selectedDate = ref<string>('')
const availableDates = ref<string[]>([])

// Función para obtener el fin de semana actual (sábado a miércoles)
const getCurrentWeekend = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = domingo, 1 = lunes, etc.
  
  // Calcular cuántos días hay que retroceder para llegar al sábado
  let daysToSaturday = dayOfWeek === 0 ? 1 : dayOfWeek + 1 // Si es domingo, retroceder 1 día
  if (dayOfWeek === 6) daysToSaturday = 0 // Si es sábado, no retroceder
  
  const saturday = new Date(today)
  saturday.setDate(today.getDate() - daysToSaturday)
  
  return saturday.toISOString().split('T')[0]
}

// Función para formatear fecha para mostrar
const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString + 'T12:00:00')
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
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

// Función para obtener fechas disponibles
const getAvailableDates = () => {
  if (!playedMatches.value) return []
  
  const dates = new Set<string>()
  
  playedMatches.value.forEach(match => {
    const matchDate = new Date(match.dateTimeUTC)
    const dateString = matchDate.toISOString().split('T')[0]
    dates.add(dateString)
  })
  
  return Array.from(dates).sort((a, b) => b.localeCompare(a)) // Ordenar de más reciente a más antigua
}

// Partidos filtrados por fecha seleccionada
const filteredMatches = computed(() => {
  if (!playedMatches.value || !selectedDate.value) return []
  
  return playedMatches.value.filter(match => {
    const matchDate = new Date(match.dateTimeUTC)
    const matchDateString = matchDate.toISOString().split('T')[0]
    return matchDateString === selectedDate.value
  }).sort((a, b) => a.dateTimeUTC - b.dateTimeUTC)
})

// Inicializar cuando se carguen los datos
onMounted(() => {
  if (playedMatches.value) {
    availableDates.value = getAvailableDates()
    
    // Establecer fecha inicial (fin de semana actual o la más reciente)
    const currentWeekend = getCurrentWeekend()
    const hasCurrentWeekend = availableDates.value.includes(currentWeekend)
    
    selectedDate.value = hasCurrentWeekend ? currentWeekend : (availableDates.value[0] || '')
  }
})

// Navegación entre fechas
const goToPreviousDate = () => {
  const currentIndex = availableDates.value.indexOf(selectedDate.value)
  if (currentIndex < availableDates.value.length - 1) {
    selectedDate.value = availableDates.value[currentIndex + 1]
  }
}

const goToNextDate = () => {
  const currentIndex = availableDates.value.indexOf(selectedDate.value)
  if (currentIndex > 0) {
    selectedDate.value = availableDates.value[currentIndex - 1]
  }
}

const canGoNext = computed(() => {
  const currentIndex = availableDates.value.indexOf(selectedDate.value)
  return currentIndex > 0
})

const canGoPrevious = computed(() => {
  const currentIndex = availableDates.value.indexOf(selectedDate.value)
  return currentIndex < availableDates.value.length - 1
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

    <div class="relative z-10 p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-center text-black dark:text-white">Partidos Jugados</h1>
      <h3 class="text-xl font-bold mb-6 text-center text-black dark:text-white">Primera C Grupo H</h3>

      <div v-if="pending" class="text-center">Cargando...</div>
      <div v-else-if="error" class="text-center text-red-500">Error al cargar los partidos.</div>
      <div v-else-if="!playedMatches || playedMatches.length === 0" 
           class="text-center text-gray-500 dark:text-gray-400">
        No hay partidos jugados disponibles.
      </div>
      <div v-else>
        <!-- Navegador de fechas -->
        <div class="mb-6">
          <!-- Controles de navegación -->
          <div class="flex items-center justify-between mb-4">
            <button
              @click="goToPreviousDate"
              :disabled="!canGoPrevious"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior Fecha
            </button>

            <div class="text-center">
              <p class="text-lg font-semibold text-black dark:text-white">
                {{ selectedDate ? formatDisplayDate(selectedDate) : 'Selecciona una fecha' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ filteredMatches.length }} partido{{ filteredMatches.length !== 1 ? 's' : '' }}
              </p>
            </div>

            <button
              @click="goToNextDate"
              :disabled="!canGoNext"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Proxima Fecha
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Selector de fecha (alternativo) -->
          <div class="text-center">
            <select
              v-model="selectedDate"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="">Selecciona una fecha</option>
              <option v-for="date in availableDates" :key="date" :value="date">
                {{ formatDisplayDate(date) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Lista de partidos -->
        <div v-if="selectedDate && filteredMatches.length === 0" 
             class="text-center text-gray-500 dark:text-gray-400 py-8">
          No hay partidos para esta fecha.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="match in filteredMatches"
            :key="match.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 p-4"
          >
            <!-- Información del partido -->
            <div class="text-center mb-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Jornada {{ match.round }} • {{ formatTime(match.dateTimeUTC) }}
              </p>
              <p class="text-xs text-green-600 dark:text-green-400 font-medium">
                FINALIZADO
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

              <!-- Resultado -->
              <div class="px-4 text-center">
                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg py-2 px-4">
                  <p class="text-2xl font-bold text-black dark:text-white">
                    {{ match.homeTeamResult.current }} - {{ match.awayTeamResult.current }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">FT</p>
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
      </div>
    </div>
  </section>
</template>