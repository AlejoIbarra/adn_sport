<script setup lang="ts">
const props = defineProps<{
  teamId: number | string | null
  teamName: string | null
  provider: string | null
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const teamData = ref<any>(null)
const loading = ref(false)

const fetchTeamDetails = async () => {
  if (!props.teamName && !props.teamId) return
  
  loading.value = true
  teamData.value = null 
  
  try {
    let finalSearchName = props.teamName

    // 1. If we have a Football-Data ID, get the official info first
    if (props.provider === 'footballdata' && props.teamId) {
      const fbRes: any = await $fetch(`/api/footballdata/team?id=${props.teamId}`)
      if (fbRes.found) {
        finalSearchName = fbRes.data.name
        // Start populating with what we have
        teamData.value = {
          name: fbRes.data.name,
          badge: fbRes.data.badge,
          founded: fbRes.data.founded,
          stadium: fbRes.data.venue,
          website: fbRes.data.website,
          stadiumLocation: fbRes.data.address
        }
      }
    }

    // 2. Enhance with SportsDB (History, Stadium Photos, Social)
    if (finalSearchName) {
      const sdbRes: any = await $fetch(`/api/sportsdb/team?name=${encodeURIComponent(finalSearchName)}`)
      if (sdbRes.found) {
        // Merge SportsDB data into our teamData
        teamData.value = {
          ...teamData.value,
          ...sdbRes.data,
          // Keep the original badge if SportsDB one is missing
          badge: sdbRes.data.badge || teamData.value?.badge,
          name: teamData.value?.name || sdbRes.data.name
        }
      }
    }
  } catch (err) {
    console.error('Error fetching team details:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.isOpen) {
    fetchTeamDetails()
  }
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchTeamDetails()
  }
})

const close = () => {
  emit('close')
  teamData.value = null
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="close"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-6xl max-h-full bg-neutral-900 rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col">
        
        <button @click="close" class="absolute top-8 right-8 z-50 w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-white hover:bg-rose-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div v-if="loading" class="flex-1 flex flex-col items-center justify-center p-20">
          <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p class="text-neutral-500 font-black uppercase tracking-widest text-xs mb-2">Cargando Inteligencia Élite...</p>
          <p class="text-blue-500 font-bold text-sm uppercase italic">{{ teamName }}</p>
        </div>

        <div v-else-if="teamData" class="flex-1 overflow-y-auto scrollbar-hide">
          <!-- Header/Banner -->
          <div class="relative h-[300px] lg:h-[450px]">
            <img v-if="teamData.banner || teamData.stadiumThumb" :src="teamData.banner || teamData.stadiumThumb" class="w-full h-full object-cover opacity-40" />
            <div v-else class="w-full h-full bg-gradient-to-br from-blue-900/50 to-neutral-900"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
            
            <div class="absolute bottom-12 left-12 right-12 flex flex-col lg:flex-row items-end gap-10">
              <div class="w-32 h-32 lg:w-56 lg:h-56 bg-neutral-950 rounded-[40px] p-6 lg:p-10 shadow-2xl border border-white/10 flex items-center justify-center backdrop-blur-xl">
                <img :src="teamData.badge" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1 space-y-4">
                <div class="flex flex-wrap gap-3">
                   <span class="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30">Fundado en {{ teamData.founded }}</span>
                </div>
                <h2 class="text-5xl lg:text-8xl font-black italic uppercase text-white tracking-tighter leading-none">{{ teamData.name }}</h2>
              </div>
            </div>
          </div>

          <!-- Info Grid -->
          <div class="p-12 lg:p-20 grid lg:grid-cols-12 gap-20">
            <!-- Left: Description -->
            <div class="lg:col-span-8 space-y-12">
              <div>
                <h3 class="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-6">Historia y Legado</h3>
                <p class="text-lg lg:text-xl text-neutral-400 leading-relaxed font-medium">
                  {{ teamData.description }}
                </p>
              </div>

              <div class="grid md:grid-cols-2 gap-8">
                <div class="p-10 rounded-[40px] bg-neutral-800/30 border border-white/5 space-y-4">
                  <span class="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Sede Oficial</span>
                  <p class="text-2xl font-black italic text-white uppercase">{{ teamData.stadium }}</p>
                </div>
                <div class="p-10 rounded-[40px] bg-neutral-800/30 border border-white/5 space-y-4">
                  <span class="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Capacidad</span>
                  <p class="text-2xl font-black italic text-white uppercase">{{ Number(teamData.stadiumCapacity).toLocaleString() }} Espectadores</p>
                </div>
              </div>
            </div>

            <!-- Right: Links & Social -->
            <div class="lg:col-span-4 space-y-12">
              <div>
                <h3 class="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-8">Conexión Digital</h3>
                <div class="flex flex-col gap-4">
                  <a v-if="teamData.website" :href="'https://' + teamData.website" target="_blank" class="flex items-center justify-between p-6 rounded-2xl bg-neutral-800 hover:bg-blue-600 transition-all group">
                    <span class="text-xs font-black uppercase text-white">Sitio Web</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-neutral-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                  </a>
                  <div class="flex gap-4">
                    <a v-if="teamData.twitter" :href="'https://' + teamData.twitter" target="_blank" class="flex-1 aspect-square rounded-2xl bg-neutral-800 flex items-center justify-center hover:bg-blue-400 transition-all">
                       <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a v-if="teamData.instagram" :href="'https://' + teamData.instagram" target="_blank" class="flex-1 aspect-square rounded-2xl bg-neutral-800 flex items-center justify-center hover:bg-rose-500 transition-all">
                       <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div class="p-10 rounded-[40px] bg-blue-600/10 border border-blue-500/20 text-center">
                 <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Ubicación</p>
                 <p class="text-xl font-bold text-white">{{ teamData.stadiumLocation }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center p-20 text-center">
           <p class="text-4xl font-black italic text-neutral-700 uppercase mb-4">Datos No Disponibles</p>
           <p class="text-neutral-500 max-w-xs">No pudimos encontrar el archivo de este equipo en la red central.</p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
