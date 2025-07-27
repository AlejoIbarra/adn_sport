<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { data: topScorers, pending, error } = await useFetch('/api/top-scorers')
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
      <h1 class="text-2xl font-bold text-center text-black dark:text-white">Tabla de Goleadores</h1>
      <h3 class="text-xl font-bold mb-4 text-center text-black dark:text-white">Primera C Grupo H</h3>

      <div v-if="pending" class="text-center">Cargando...</div>
      <div v-else-if="error" class="text-center text-red-500">Error al cargar los goleadores.</div>
      <div v-else-if="!topScorers || topScorers.length === 0" 
           class="text-center text-gray-500 dark:text-gray-400">
        No hay datos de goleadores disponibles.
      </div>
      <div v-else>
        <div class="overflow-x-auto rounded-lg shadow-md">
          <table class="w-full text-xs sm:text-sm md:text-base text-left border border-gray-300 text-black dark:text-white bg-transparent">
            <thead class="bg-gray-100 dark:bg-gray-800 text-[10px] sm:text-xs uppercase">
              <tr>
                <th class="px-2 py-2">#</th>
                <th class="px-2 py-2">Equipo</th>
                <th class="px-2 py-2">Goles</th>
                <th class="px-2 py-2">Promedio</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(team, index) in topScorers"
                :key="team.name"
                class="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <!-- Posición con medalla para los primeros 3 -->
                <td class="px-2 py-2">
                  <div class="flex items-center">
                    <span v-if="index === 0" class="text-yellow-500 text-lg mr-1">🥇</span>
                    <span v-else-if="index === 1" class="text-gray-400 text-lg mr-1">🥈</span>
                    <span v-else-if="index === 2" class="text-orange-600 text-lg mr-1">🥉</span>
                    {{ index + 1 }}
                  </div>
                </td>
                
                <!-- Equipo con escudo -->
                <td class="px-2 py-2">
                  <div class="flex items-center gap-2">
                    <img
                      :src="`/teams/${team.picture}.png`"
                      alt="Escudo del equipo"
                      class="w-8 h-8 object-contain"
                    />
                    <span class="truncate block font-medium" :title="team.name">
                      {{ team.name }}
                    </span>
                  </div>
                </td>
                
                <!-- Goles -->
                <td class="px-2 py-2">
                  <span class="font-bold text-lg text-green-600 dark:text-green-400">
                    {{ team.gf }}
                  </span>
                </td>
                
                <!-- Promedio de goles por partido -->
                <td class="px-2 py-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ team.played > 0 ? (team.gf / team.played).toFixed(2) : '0.00' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Estadísticas adicionales -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-300 dark:border-gray-700">
            <h4 class="text-lg font-semibold text-black dark:text-white mb-2">Total de Goles</h4>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ topScorers.reduce((sum, team) => sum + team.gf, 0) }}
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-300 dark:border-gray-700">
            <h4 class="text-lg font-semibold text-black dark:text-white mb-2">Promedio por Partido</h4>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ 
                topScorers.length > 0 
                  ? (topScorers.reduce((sum, team) => sum + team.gf, 0) / topScorers.reduce((sum, team) => sum + team.played, 0)).toFixed(2)
                  : '0.00'
              }}
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-300 dark:border-gray-700">
            <h4 class="text-lg font-semibold text-black dark:text-white mb-2">Máximo Goleador</h4>
            <p class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {{ topScorers.length > 0 ? topScorers[0].name : 'N/A' }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ topScorers.length > 0 ? topScorers[0].gf + ' goles' : '' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>