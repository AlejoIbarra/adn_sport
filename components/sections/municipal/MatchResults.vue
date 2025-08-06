<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  partidos: {
    local: string
    local_logo: string
    localGol?: number
    visitante: string
    visitante_logo: string
    visitanteGol?: number
    grupo: string
    hora: string  // "13:30:00"
    fecha: string // "2025-08-02"
  }[]
  fechaSeleccionada: string
}>()

function getEstado(fecha: string, hora: string): string {
  const ahora = new Date()
  const partidoDate = new Date(`${fecha}T${hora}`)
  const diff = (ahora.getTime() - partidoDate.getTime()) / 60000 // minutos

  if (diff < 0) return 'Programado'
  if (diff >= 0 && diff <= 120) return 'Jugando'
  return 'Finalizado'
}

function formatearHora(hora: string): string {
  return hora.slice(0, 5)
}

function obtenerNombreDia(fecha: string): string {
  // Añadir hora fija a la fecha para evitar desajustes por zona horaria
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  // Crear Date con formato ISO completo en UTC
  const d = new Date(fecha + 'T00:00:00')
  return dias[d.getDay()]
}


// Agrupar partidos por fecha
const partidosPorFecha = computed(() => {
  const agrupado: Record<string, typeof __props.partidos> = {}

  for (const partido of __props.partidos) {
    if (!agrupado[partido.fecha]) {
      agrupado[partido.fecha] = []
    }
    agrupado[partido.fecha].push(partido)
  }

  // Opcional: ordenar las fechas ascendente
  const fechasOrdenadas = Object.keys(agrupado).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const resultado: Record<string, typeof __props.partidos> = {}
  fechasOrdenadas.forEach(fecha => {
    resultado[fecha] = agrupado[fecha]
  })

  return resultado
})
</script>

<template>
  <section class="relative w-full ">
    <!-- Fondo logo opaco -->
    <div class="absolute inset-0 flex justify-center items-center pointer-events-none" aria-hidden="true">
      <img src="/iconos/adn_color.png" alt="ADN Deportivo" class="opacity-10 dark:opacity-20" />
    </div>

    <div class="relative z-10 pb-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-center text-black dark:text-white mb-2">Partidos por Jornada</h1>
      <h3 class="text-xl font-bold mb-6 text-center text-black dark:text-white">
        {{ fechaSeleccionada }}
      </h3>

      <div v-if="!partidos || partidos.length === 0" class="text-center text-gray-500 dark:text-gray-400 mb-4">
        No hay partidos disponibles.
      </div>

      <div v-else>
        <div v-for="(partidosDia, fecha) in partidosPorFecha" :key="fecha" class="mb-8">
          <!-- Título día -->
          <h2 class="text-xl font-semibold text-center mb-4 text-black dark:text-white">
            {{ obtenerNombreDia(fecha) }} - {{ fecha }}
          </h2>

          <div class="space-y-1">
            <div
              v-for="(partido, index) in partidosDia"
              :key="index"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 "
            >
              <!-- Información del partido -->
              <div class="text-center mb-3 pt-1">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ partido.fecha }} • {{ formatearHora(partido.hora) }}
                </p>
                <p
                  :class="{
                    'text-xs font-medium': true,
                    'text-green-600 dark:text-green-400': getEstado(partido.fecha, partido.hora) === 'Finalizado',
                    'text-blue-600 dark:text-blue-400': getEstado(partido.fecha, partido.hora) === 'Programado',
                    'text-orange-600 dark:text-orange-400': getEstado(partido.fecha, partido.hora) === 'Jugando',
                  }"
                >
                  {{ getEstado(partido.fecha, partido.hora).toUpperCase() }}
                </p>
              </div>

              <!-- Equipos y resultado -->
              <div class="flex items-center justify-between">
                <!-- Equipo Local -->
                <div class="flex-1 text-center">
                  <div class="flex flex-col items-center">
                    <img
                      :src="`/${partido.local_logo}`"
                      :alt="partido.local"
                      class="w-12 h-12 object-contain mb-2"
                    />
                    <p class="text-sm font-medium text-black dark:text-white">{{ partido.local }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Local</p>
                  </div>
                </div>

                <!-- Resultado o hora -->
                <div class="px-4 text-center">
                  <div
                    v-if="typeof partido.localGol === 'number' && typeof partido.visitanteGol === 'number'"
                    class="bg-gray-100 dark:bg-gray-700 rounded-lg py-2 px-4"
                  >
                    <p class="text-2xl font-bold text-black dark:text-white">
                      {{ partido.localGol }} - {{ partido.visitanteGol }}
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">FT</p>
                  </div>
                  <div v-else class="bg-blue-100 dark:bg-blue-900 rounded-lg py-2 px-4">
                    <p class="text-xl font-bold text-blue-600 dark:text-blue-400">VS</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatearHora(partido.hora) }}</p>
                  </div>
                </div>

                <!-- Equipo Visitante -->
                <div class="flex-1 text-center">
                  <div class="flex flex-col items-center">
                    <img
                      :src="`/${partido.visitante_logo}`"
                      :alt="partido.visitante"
                      class="w-12 h-12 object-contain mb-2"
                    />
                    <p class="text-sm font-medium text-black dark:text-white">{{ partido.visitante }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Visitante</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
