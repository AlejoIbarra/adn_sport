<template>
  <section class="py-20">
    <div class="text-center font-sans px-5">
      <h1 class="text-2xl font-bold mb-10 text-white">Campeonatos Municipales</h1>

      <div class="grid gap-6 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-items-center">
        <template v-for="municipality in municipalities" :key="municipality.id">
          <NuxtLink
            v-if="municipality?.unlocked"
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

          <div
            v-else
            class="w-[150px] h-[180px] border-2 border-gray-300 rounded-lg bg-white shadow-md p-2 flex flex-col items-center justify-between relative cursor-not-allowed opacity-60"
          >
            <div class="relative w-full h-[100px] flex items-center justify-center">
              <img
                :src="municipality.flag"
                :alt="`Bandera de ${municipality.name}`"
                class="w-[80px] h-[80px] object-cover rounded-full filter grayscale"
              />
              <span
                class="absolute text-3xl text-gray-500/80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                🔒
              </span>
            </div>
            <p class="text-sm text-gray-800 mt-2">{{ municipality.name }}</p>
          </div>
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
  },
  {
    id: 2,
    name: 'Pasto',
    flag: '/municipios/pasto.png',
    unlocked: false,
    route: '/municipal/pasto',
  },
  {
    id: 3,
    name: 'Ipiales',
    flag: '/municipios/ipiales.png',
    unlocked: false,
    route: '/municipal/ipiales',
  },
  {
    id: 4,
    name: 'Tumaco',
    flag: '/municipios/tumaco.png',
    unlocked: false,
    route: '/municipal/tumaco',
  },
  {
    id: 5,
    name: 'Barbacoas',
    flag: '/municipios/barbacoas.png',
    unlocked: false,
    route: '/municipal/barbacoas',
  },
]
</script>

<style scoped>
.flag-img.grayscale {
  filter: grayscale(100%);
}

.lock-icon-overlay {
  position: absolute;
  font-size: 2rem;
  color: rgba(100, 100, 100, 0.8);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.municipality-name {
  font-size: 14px;
  margin-top: 10px;
  color: #333;
}
</style>
