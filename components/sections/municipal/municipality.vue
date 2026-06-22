<template>
  <section class="py-20 flex justify-center">
    <div class="text-center font-sans px-5 max-w-5xl w-full">
      <h1 class="text-2xl font-bold mb-10 text-neutral-900 dark:text-white">Campeonatos Municipales</h1>

      <div class="flex flex-wrap justify-center gap-6">
        <template v-for="municipality in municipalities" :key="municipality.id">
          <NuxtLink
            :to="municipality.route"
            class="w-[150px] h-[180px] border-2 border-gray-300 rounded-lg bg-white shadow-md p-2 flex flex-col items-center justify-between transition-transform duration-300 hover:scale-105 relative cursor-pointer"
          >
            <div class="relative w-full h-[100px] flex items-center justify-center">
              <img
                :src="municipality.flag"
                :alt="`Bandera de ${municipality.name}`"
                class="w-[80px] h-[80px] object-cover rounded-full transition duration-300"
              />
            </div>
            <p class="text-sm text-gray-800 mt-2">{{ municipality.name }}</p>
          </NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
const municipalities = [
  {
    id: 1,
    name: 'La Cruz',
    flag: '/municipios/la-cruz.png',
    unlocked: true,
    route: '/municipal/la-cruz',
  }
]
</script>

<style scoped>
.municipality-name {
  font-size: 14px;
  margin-top: 10px;
  color: #333;
}
</style>
