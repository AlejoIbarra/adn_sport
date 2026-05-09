<script setup lang="ts">
import { getLeagueBySlug } from '~/config/leagues'

const route = useRoute()
const leagueConfig = getLeagueBySlug('primera-c-colombia')

if (!leagueConfig) {
  throw createError({ statusCode: 404, statusMessage: 'League not found' })
}

const tournamentId = leagueConfig.id

// I18N Setup
const lang = ref('es')
const t: any = {
  es: {
    heroTitle: 'Primera C Colombia',
    heroSubtitle: 'El semillero del fútbol colombiano. Toda la pasión de la categoría C en un solo lugar.',
    season: 'TEMPORADA',
    posiciones: 'Tabla de Posiciones',
    equipos: 'Equipos',
    pts: 'Pts',
    cronograma: 'Calendario de Partidos',
    faseGrupos: 'Fase de Grupos',
    seleccionarGrupo: 'Seleccionar Grupo',
    cargando: 'Sincronizando con FCF...',
    sinDatos: 'Sin partidos recientes.',
    proximasBatallas: 'Próximas Batallas (Global)'
  },
  en: {
    heroTitle: 'Colombia Primera C',
    heroSubtitle: 'The breeding ground of Colombian football. All the passion of category C in one place.',
    season: 'SEASON',
    posiciones: 'Standings Table',
    equipos: 'Teams',
    pts: 'Pts',
    cronograma: 'Match Schedule',
    faseGrupos: 'Group Stage',
    seleccionarGrupo: 'Select Group',
    cargando: 'Syncing with FCF...',
    sinDatos: 'No recent matches.',
    proximasBatallas: 'Upcoming Battles (Global)'
  }
}

const cur = computed(() => t[lang.value])

// Data Fetching
const { data: fcfGroups, pending: groupsPending } = await useFetch(`/api/fcf/competition?id=${tournamentId}`)
const currentGroupId = ref(null)

// Initialize group ID once data is available
watch(fcfGroups, (newData) => {
  if (newData?.competitionElements?.[0]?.id && !currentGroupId.value) {
    currentGroupId.value = newData.competitionElements[0].id
  }
}, { immediate: true })

const { data: futureMatches, pending: futurePending } = await useFetch(`/api/fcf/future-matches?id=${tournamentId}`)

const { data: rawStandings, pending: standingsPending } = await useFetch(() => 
  currentGroupId.value ? `/api/fcf/standings?groupId=${currentGroupId.value}` : null
)

const { data: rawMatches, pending: matchesPending } = await useFetch(() => 
  currentGroupId.value ? `/api/fcf/matches?groupId=${currentGroupId.value}` : null
)

// UI State
const isTeamModalOpen = ref(false)
const selectedTeamName = ref<string | null>(null)
const selectedTeamId = ref<number | string | null>(null)

const openTeamDetails = (name: string, id: number | string) => {
  selectedTeamName.value = name
  selectedTeamId.value = id
  isTeamModalOpen.value = true
}

// Group Name Helper
const getShortGroupName = (name: string) => {
  if (!name) return 'Grupo'
  return name.split(' /')[0].replace('GRUPO-', 'G-')
}
</script>

<template>
  <main class="min-h-screen bg-[#050505] text-neutral-100 font-sans selection:bg-blue-500/30">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden border-b border-white/5">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f620,transparent_70%)] animate-pulse-slow"></div>
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      
      <div class="container mx-auto px-6 relative z-10 text-center">
         <div class="mb-10 inline-flex px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
           {{ cur.season }} {{ fcfGroups?.name?.split(' ')[2] || '2026' }}
         </div>
         <h1 class="text-7xl lg:text-[10rem] font-black tracking-tighter mb-10 italic uppercase leading-[0.8] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-700">
           {{ cur.heroTitle }}
         </h1>
         <p class="text-xl lg:text-3xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium">
           {{ cur.heroSubtitle }}
         </p>
      </div>
    </section>

    <!-- Future Pulse -->
    <section v-if="futureMatches?.length" class="py-16 bg-blue-600/5 border-b border-white/5 relative overflow-hidden">
      <div class="container mx-auto px-6 relative z-10">
        <div class="flex items-center justify-between mb-10">
           <div class="flex items-center gap-4">
             <div class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
             <h2 class="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">{{ cur.proximasBatallas }}</h2>
           </div>
        </div>
        
        <div class="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
          <div v-for="match in futureMatches" :key="match.id" 
               class="min-w-[340px] p-8 rounded-[40px] bg-neutral-900/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all duration-500 group snap-center shadow-2xl">
            <div class="flex justify-between items-center mb-8">
              <span class="text-[9px] font-black text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-xl uppercase tracking-tighter">{{ match.groupName }}</span>
              <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{{ new Date(match.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            
            <div class="space-y-6 mb-8">
              <div class="flex items-center justify-between group/team cursor-pointer" @click="openTeamDetails(match.homeTeam.name, match.homeTeam.id)">
                <div class="flex items-center gap-4">
                  <img :src="match.homeTeam.image" class="w-8 h-8 object-contain filter group-hover/team:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" />
                  <span class="text-base font-black text-white uppercase italic tracking-tight group-hover/team:text-blue-400">{{ match.homeTeam.name }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between group/team cursor-pointer" @click="openTeamDetails(match.awayTeam.name, match.awayTeam.id)">
                <div class="flex items-center gap-4">
                  <img :src="match.awayTeam.image" class="w-8 h-8 object-contain filter group-hover/team:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" />
                  <span class="text-base font-black text-white uppercase italic tracking-tight group-hover/team:text-blue-400">{{ match.awayTeam.name }}</span>
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-white/5 flex items-center gap-3">
               <div class="p-2 rounded-lg bg-neutral-800">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
               <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">{{ match.facility || 'Sede por confirmar' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Group Selector Sticky -->
    <section class="sticky top-24 z-50 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/5 py-8">
      <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row lg:items-center gap-8">
          <div class="flex items-center gap-4 shrink-0">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black italic text-xl shadow-lg shadow-blue-600/20">C</div>
            <h2 class="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">{{ cur.seleccionarGrupo }}</h2>
          </div>
          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button v-for="group in fcfGroups?.competitionElements" :key="group.id"
                    @click="currentGroupId = group.id"
                    :class="currentGroupId === group.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 border-blue-500' : 'bg-neutral-900 text-neutral-500 border-white/5 hover:border-blue-500/30'"
                    class="px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all duration-300 whitespace-nowrap border">
              {{ getShortGroupName(group.name) }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Data Grid -->
    <section class="py-24">
      <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-12 gap-20">
          
          <!-- Standings -->
          <div class="lg:col-span-8 space-y-16">
            <h3 class="text-4xl lg:text-6xl font-black italic uppercase text-white tracking-tighter">{{ cur.posiciones }}</h3>

            <div v-if="standingsPending" class="p-32 text-center bg-neutral-900 rounded-[64px] border border-white/5 shadow-inner">
               <div class="w-16 h-16 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-2xl"></div>
               <p class="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">{{ cur.cargando }}</p>
            </div>

            <div v-else class="bg-neutral-900 rounded-[64px] border border-white/5 overflow-hidden shadow-4xl group/table">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] border-b border-white/5 bg-white/[0.02]">
                      <th class="px-10 py-8 w-20">#</th>
                      <th class="px-4 py-8 min-w-[300px]">{{ cur.equipos }}</th>
                      <th class="px-4 py-8 text-center">PJ</th>
                      <th class="px-4 py-8 text-center">G</th>
                      <th class="px-4 py-8 text-center">E</th>
                      <th class="px-4 py-8 text-center">P</th>
                      <th class="px-10 py-8 text-center bg-blue-600/10 text-blue-400">PTS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr v-for="row in rawStandings" :key="row.team.id" class="hover:bg-blue-600/[0.04] transition-all duration-500 group/row">
                      <td class="px-10 py-8 text-lg font-black italic text-neutral-700 group-hover/row:text-blue-500 transition-colors">{{ row.position }}</td>
                      <td class="px-4 py-8">
                        <div class="flex items-center gap-5 cursor-pointer" @click="openTeamDetails(row.team.name, row.team.id)">
                          <img :src="row.team.image" class="w-10 h-10 object-contain drop-shadow-xl" />
                          <div class="flex flex-col">
                            <span class="font-black text-lg text-white uppercase italic tracking-tighter group-hover/row:translate-x-2 transition-transform duration-500">{{ row.team.name }}</span>
                            <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{{ row.team.place }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-8 text-center text-base font-bold text-neutral-400">{{ row.played }}</td>
                      <td class="px-4 py-8 text-center text-base font-bold text-emerald-500">{{ row.wins }}</td>
                      <td class="px-4 py-8 text-center text-base font-bold text-neutral-600">{{ row.draws }}</td>
                      <td class="px-4 py-8 text-center text-base font-bold text-rose-500">{{ row.losses }}</td>
                      <td class="px-10 py-8 text-center font-black text-2xl text-blue-400 bg-blue-600/[0.05]">{{ row.points }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Matches -->
          <div class="lg:col-span-4 space-y-16">
            <h3 class="text-4xl lg:text-6xl font-black italic uppercase text-white tracking-tighter">{{ cur.cronograma }}</h3>
            
            <div v-if="matchesPending" class="p-16 text-center bg-neutral-900 rounded-[56px] border border-white/5 shadow-inner">
               <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>

            <div v-else-if="!rawMatches?.length" class="p-20 text-center bg-neutral-900 rounded-[56px] border border-white/5 border-dashed">
               <p class="text-neutral-600 text-sm font-black uppercase tracking-[0.2em]">{{ cur.sinDatos }}</p>
            </div>

            <div v-else class="space-y-6">
               <div v-for="match in rawMatches" :key="match.id" 
                    class="p-8 rounded-[48px] bg-neutral-900 border border-white/5 hover:border-blue-500/40 transition-all duration-700 group hover:shadow-3xl hover:shadow-blue-600/10">
                  <div class="flex items-center justify-between mb-8">
                     <span class="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">{{ new Date(match.date).toLocaleDateString() }}</span>
                     <span class="px-3 py-1 rounded-full bg-neutral-800 text-[9px] font-black text-blue-500 uppercase tracking-widest border border-white/5">{{ match.status }}</span>
                  </div>
                  
                  <div class="space-y-6">
                     <div class="flex items-center justify-between group/team cursor-pointer" @click="openTeamDetails(match.homeTeam.name, match.homeTeam.id)">
                        <div class="flex items-center gap-4">
                           <img :src="match.homeTeam.image" class="w-8 h-8 object-contain group-hover/team:scale-110 transition-transform" />
                           <span class="text-base font-black text-white uppercase italic tracking-tighter group-hover/team:text-blue-400">{{ match.homeTeam.name }}</span>
                        </div>
                        <span class="text-2xl font-black italic text-white">{{ match.homeScore ?? '-' }}</span>
                     </div>
                     <div class="flex items-center justify-between group/team cursor-pointer" @click="openTeamDetails(match.awayTeam.name, match.awayTeam.id)">
                        <div class="flex items-center gap-4">
                           <img :src="match.awayTeam.image" class="w-8 h-8 object-contain group-hover/team:scale-110 transition-transform" />
                           <span class="text-base font-black text-white uppercase italic tracking-tighter group-hover/team:text-blue-400">{{ match.awayTeam.name }}</span>
                        </div>
                        <span class="text-2xl font-black italic text-white">{{ match.awayScore ?? '-' }}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Modal -->
    <ModalsTeamModal 
      :key="selectedTeamId || 'none'"
      :is-open="isTeamModalOpen" 
      :team-id="selectedTeamId"
      :team-name="selectedTeamName" 
      provider="fcf"
      @close="isTeamModalOpen = false; selectedTeamName = null; selectedTeamId = null" 
    />
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@900&display=swap');

.font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
h1, h2, h3, h4, .font-black { font-family: 'Inter', sans-serif; letter-spacing: -0.05em; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.shadow-4xl {
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
}
</style>
