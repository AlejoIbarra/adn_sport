<script setup>
import TableStandings from './TableStandings.vue'
import MatchResults from './/MatchResults.vue'

import { ref, computed, onMounted, watch } from 'vue'

const campeonato = ref(null)
const grupos = ref([])
const grupoSeleccionado = ref(null)
const fechas = ref([])
const fechaSeleccionada = ref(null)

onMounted(async () => {
  const res = await fetch('/data/campeonato.json')
  campeonato.value = await res.json()

  // Inicializar grupos y fechas
  grupos.value = Object.keys(campeonato.value.grupos)
  fechas.value = campeonato.value.resultados.map(r => r.fecha)

  // Restaurar selección previa o usar por defecto
  grupoSeleccionado.value = localStorage.getItem('grupoSeleccionado') || grupos.value[0]
  fechaSeleccionada.value = localStorage.getItem('fechaSeleccionada') || fechas.value[0]
})

const partidosPorFecha = computed(() => {
  if (!campeonato.value) return []

  const fecha = campeonato.value.resultados.find(f => f.fecha === fechaSeleccionada.value)
  return fecha ? fecha.partidos : []
})

const estadoPartido = (horaISO) => {
  const ahora = new Date()
  const inicio = new Date(horaISO)
  const diff = (ahora - inicio) / 60000 // diferencia en minutos

  if (diff < 0) return 'Programado'
  if (diff >= 0 && diff <= 120) return 'Jugando'
  if (diff > 120) return 'Esperando actualización'
  return 'Desconocido'
}

watch(grupoSeleccionado, (nuevo) => {
  localStorage.setItem('grupoSeleccionado', nuevo)
})

watch(fechaSeleccionada, (nueva) => {
  localStorage.setItem('fechaSeleccionada', nueva)
})

</script>

<template>
  <section class=" max-w-5xl mx-auto font-sans">

    <img src="/championships/la-cruz/campeonato-municipal/alcaldia-la-cruz.png" alt="Logo alcaldia La Cruz" class="w-96 mx-auto mb-6" />
    <div v-if="campeonato">
      <h1 class="text-xl font-bold mb-2 text-black dark:text-white">{{ campeonato.info.titulo }}</h1>
      <p class="mb-6 text-black dark:text-white">{{ campeonato.info.organiza }}</p>
      <p class="mb-6 text-black dark:text-white font-semibold">{{ campeonato.info.boletin }}</p>


      <!-- Tabla de posiciones -->

        <div class="mb-6 flex gap-3">
        <button
            v-for="g in Object.keys(campeonato.grupos)"
            :key="g"
            @click="grupoSeleccionado = g"
            :class="{'bg-blue-600 text-black dark:text-white': grupoSeleccionado === g, 'bg-gray-200': grupoSeleccionado !== g}"
            class="px-4 py-2 rounded"
        >Grupo {{ g }}</button>
        </div>
        <TableStandings :grupo="grupoSeleccionado" :equipos="campeonato.grupos[grupoSeleccionado]" />


      <!-- Selección de fecha -->
      <div class="mt-6 flex gap-3">
        <button
          v-for="f in fechas"
          :key="f"
          @click="fechaSeleccionada = f"
          :class="{'bg-green-600 text-white': fechaSeleccionada === f, 'bg-gray-200': fechaSeleccionada !== f}"
          class="px-4 py-2 rounded"
        >{{ f }}</button>
      </div>

      <!-- Resultados fecha -->
        <MatchResults :fechaSeleccionada="fechaSeleccionada" :partidos="partidosPorFecha" />


      <!-- Tarjetas Amarillas -->
      <!-- <div class="mt-10">
        <h2 class="text-lg font-semibold mb-2">Tarjetas Amarillas</h2>
        <ul>
          <li v-for="tarjeta in campeonato.tarjetas.filter(t => t.tipo === 'amarilla')" :key="tarjeta.jugador" class="mb-1">
            {{ tarjeta.jugador }} ({{ tarjeta.equipo }})
          </li>
        </ul>
      </div> -->
    </div>

    <div v-else class="text-center py-20 text-gray-500">
      Cargando datos...
    </div>
    <img src="/championships/la-cruz/campeonato-municipal/alcaldia-la-cruz.png" alt="Logo alcaldia La Cruz" class="w-96 mx-auto mb-6" />

  </section>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.3rem 0.6rem;
}
</style>
