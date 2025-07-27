<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { fetchTeamImage } from '@/composables/useImageFetcher'

const { data: standings, pending, error } = await useFetch('/api/standings')

// Mapa para guardar imágenes por teamId o pictureId
const teamImages = ref<Record<string, string>>({})

onMounted(async () => {
  if (!standings.value) return

  for (const team of standings.value) {
    if (team.picture) {
    //   const img = await fetchTeamImage(team.picture)
    //   if (img) {
    //     teamImages.value[team.picture] = img
    //   }
    }
  }
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
        class=" opacity-10 dark:opacity-20"
      />
    </div>

    <div class="relative z-10 p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold  text-center text-black dark:text-white">Tabla de Posiciones</h1>
      <h3 class="text-xl font-bold mb-4 text-center text-black dark:text-white">Primera C Grupo H</h3>

      <div v-if="pending" class="text-center">Cargando...</div>
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
                <th class="px-1 py-2">DG</th>
                <th class="px-1 py-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(team, index) in standings"
                :key="team.name"
                class="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td class="px-2 py-2">{{ index + 1 }}</td>
                <td class="px-1 py-2 flex items-center gap-2">
                  <img
                    :src="`/teams/${team.picture}.png`"
                    alt="Escudo del equipo"
                    class="w-8 h-8 object-contain"
                  />
                    <span class="truncate block" :title="team.name">{{ team.name }}</span>
                </td>
                <td class="px-1 py-2">{{ team.played }}</td>
                <td class="px-1 py-2">{{ team.won }}</td>
                <td class="px-1 py-2">{{ team.drawn }}</td>
                <td class="px-1 py-2">{{ team.lost }}</td>
                <td class="px-1 py-2">{{ team.gf }}</td>
                <td class="px-1 py-2">{{ team.ga }}</td>
                <td class="px-1 py-2">{{ team.gd }}</td>
                <td class="px-1 py-2 font-bold">{{ team.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
