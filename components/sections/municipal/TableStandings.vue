<script setup lang="ts">
import { defineProps } from 'vue'

interface Team {
  id: number | string
  nombre: string
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  gd: number
  jl: number
  pto: number
  picture?: string // Opcional, para escudo o imagen del equipo
}

const props = defineProps<{
  grupo: string
  equipos: Team[]
  loading?: boolean
  error?: boolean
}>()
</script>

<template>
  <section class="relative w-full">
    <!-- Fondo logo con opacidad -->
    <div class="absolute inset-0 flex justify-center items-center pointer-events-none" aria-hidden="true">
      <img src="/iconos/adn_color.png" alt="ADN Deportivo" class="opacity-10 dark:opacity-20" />
    </div>

    <div class="relative z-10 px-6 max-w-4xl mx-auto">
      <h3 class="text-xl font-bold mb-4 text-center text-black dark:text-white">Grupo {{ grupo }}</h3>

      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else-if="error" class="text-center text-red-500">Error al cargar la tabla.</div>
      <div v-else>
        <div class="overflow-x-auto rounded-lg shadow-md">
          <table class="w-full text-xs sm:text-sm md:text-base text-left border border-gray-300 text-black dark:text-white bg-transparent">
            <thead class="bg-gray-100 dark:bg-gray-800 text-[10px] sm:text-xs uppercase">
              <tr>
                <th class="px-2 py-2">#</th>
                <th class="px-1 py-2">Equipo</th>
                <th class="px-1 py-2">PJ</th>
                <th class="px-1 py-2">PG</th>
                <th class="px-1 py-2">PE</th>
                <th class="px-1 py-2">PP</th>
                <th class="px-1 py-2">GF</th>
                <th class="px-1 py-2">GC</th>
                <th class="px-1 py-2">GD</th>
                <th class="px-1 py-2">JL</th>
                <th class="px-1 py-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(team, index) in equipos"
                :key="team.id"
                class="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td class="px-2 py-2">{{ index + 1 }}</td>
                <td class="px-1 py-2 flex items-center gap-2">
                  <img
                    v-if="team.picture"
                    :src="`/${team.picture}`"
                    alt="Escudo del equipo"
                    class="w-8 h-8 object-contain"
                  />
                  <span class="truncate block" :title="team.nombre">{{ team.nombre }}</span>
                </td>
                <td class="px-1 py-2">{{ team.pj }}</td>
                <td class="px-1 py-2">{{ team.pg }}</td>
                <td class="px-1 py-2">{{ team.pe }}</td>
                <td class="px-1 py-2">{{ team.pp }}</td>
                <td class="px-1 py-2">{{ team.gf }}</td>
                <td class="px-1 py-2">{{ team.gc }}</td>
                <td class="px-1 py-2">{{ team.gd }}</td>
                <td class="px-1 py-2">{{ team.jl }}</td>
                <td class="px-1 py-2 font-bold">{{ team.pto }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Puedes agregar estilos adicionales si quieres */
</style>
