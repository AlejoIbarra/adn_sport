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
    heroTitle: 'PRIMERA C',
    heroSubtitle: 'El epicentro del ascenso colombiano. Sigue a los 27 grupos que luchan por la gloria nacional.',
    season: 'TEMPORADA 2026',
    posiciones: 'TABLA DE POSICIONES',
    equipos: 'CLUB',
    pts: 'PTS',
    cronograma: 'CRONOGRAMA DE PARTIDOS',
    seleccionarGrupo: 'CENTRO DE MANDOS • SELECCIONAR GRUPO',
    cargando: 'Sincronizando con Analyticom...',
    sinDatos: 'Sin registros.',
    proximasBatallas: 'RADAR DE PRÓXIMAS FECHAS',
    grupoActual: 'GRUPO ACTUAL'
  },
  en: {
    heroTitle: 'PRIMERA C',
    heroSubtitle: 'The epicenter of Colombian promotion. Follow the 27 groups fighting for national glory.',
    season: '2026 SEASON',
    posiciones: 'STANDINGS',
    equipos: 'CLUB',
    pts: 'PTS',
    cronograma: 'MATCH SCHEDULE',
    seleccionarGrupo: 'COMMAND CENTER • SELECT GROUP',
    cargando: 'Syncing with Analyticom...',
    sinDatos: 'No records.',
    proximasBatallas: 'MATCH RADAR',
    grupoActual: 'CURRENT GROUP'
  }
}

const cur = computed(() => t[lang.value])

// Data Fetching
const { data: fcfGroups, pending: groupsPending } = await useFetch(`/api/fcf/competition?id=${tournamentId}`)
const currentGroupId = ref(null)
const isGroupMenuOpen = ref(false)

// Initialize group ID
watch(fcfGroups, (newData) => {
  if (newData?.competitionElements?.[0]?.id && !currentGroupId.value) {
    currentGroupId.value = newData.competitionElements[0].id
  }
}, { immediate: true })

const currentGroupName = computed(() => {
  const g = fcfGroups.value?.competitionElements?.find(g => g.id === currentGroupId.value)
  return g ? g.name.split(' /')[0] : 'Seleccionar'
})

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

const selectGroup = (id) => {
  currentGroupId.value = id
  isGroupMenuOpen.value = false
  window.scrollTo({ top: 400, behavior: 'smooth' })
}
</script>

<template>
  <main class="min-h-screen bg-[#000000] text-neutral-100 font-sans selection:bg-blue-600/50 overflow-x-hidden">
    <!-- Brutal Hero -->
    <section class="relative pt-40 pb-24 lg:pt-64 lg:pb-48 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_50%_-20%,#1d4ed830,transparent_60%)] animate-pulse-slow"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10 text-center">
         <div class="mb-12 inline-flex items-center gap-4 px-8 py-3 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] animate-fade-in shadow-2xl">
           {{ cur.season }}
         </div>
         <h1 class="text-8xl lg:text-[14rem] font-black tracking-tighter mb-12 italic leading-[0.75] uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-700 animate-title">
           {{ cur.heroTitle }}<br/>
           <span class="text-blue-600">COLOMBIA</span>
         </h1>
         <p class="text-xl lg:text-3xl text-neutral-500 max-w-4xl mx-auto leading-relaxed font-bold italic">
           {{ cur.heroSubtitle }}
         </p>
      </div>
    </section>

    <!-- Interactive Group Command Center -->
    <section class="sticky top-24 z-50 py-6 bg-black/60 backdrop-blur-3xl border-y border-white/5">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div class="flex items-center gap-6">
            <div class="relative">
              <button @click="isGroupMenuOpen = !isGroupMenuOpen" 
                      class="flex items-center gap-6 px-8 py-4 bg-neutral-900 border border-white/10 rounded-[24px] hover:border-blue-600/50 transition-all group relative overflow-hidden">
                <div class="absolute inset-0 bg-blue-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div class="flex flex-col items-start relative z-10">
                  <span class="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{{ cur.grupoActual }}</span>
                  <span class="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{{ currentGroupName }}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" 
                     class="w-6 h-6 text-neutral-700 group-hover:text-blue-400 transition-all duration-500" 
                     :class="{'rotate-180': isGroupMenuOpen}"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Advanced Interactive Dropdown -->
              <transition name="dropdown">
                <div v-if="isGroupMenuOpen" 
                     class="absolute top-full left-0 mt-6 w-[320px] md:w-[600px] lg:w-[800px] bg-[#0A0A0A] border border-white/10 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-10 z-[60] overflow-hidden">
                  <div class="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#1d4ed810,transparent_50%)]"></div>
                  
                  <div class="relative z-10">
                    <h3 class="text-xs font-black text-neutral-600 uppercase tracking-[0.4em] mb-8">{{ cur.seleccionarGrupo }}</h3>
                    <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-custom">
                      <button v-for="group in fcfGroups?.competitionElements" :key="group.id"
                              @click="selectGroup(group.id)"
                              :class="currentGroupId === group.id ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-neutral-800 text-neutral-500 border-white/5 hover:border-blue-600/50 hover:text-white'"
                              class="aspect-square flex flex-col items-center justify-center rounded-3xl border transition-all duration-300 group/item">
                        <span class="text-[9px] font-black uppercase mb-1 opacity-50">{{ group.name.split('-')[0] }}</span>
                        <span class="text-xl font-black italic">{{ group.name.split('-')[1]?.split(' ')[0] }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Quick Stats Summary in Bar -->
          <div v-if="!standingsPending && rawStandings?.length" class="hidden lg:flex items-center gap-12 px-10 py-4 bg-white/5 rounded-full border border-white/5 backdrop-blur-xl">
             <div class="flex flex-col">
                <span class="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Líder</span>
                <span class="text-sm font-black text-white italic uppercase tracking-tighter">{{ rawStandings[0].team.name }}</span>
             </div>
             <div class="w-px h-8 bg-white/10"></div>
             <div class="flex flex-col">
                <span class="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Goles</span>
                <span class="text-sm font-black text-white italic tracking-tighter">{{ rawStandings[0].goalsFor }}</span>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Match Radar -->
    <section v-if="futureMatches?.length" class="py-16 overflow-hidden">
      <div class="container mx-auto px-6">
        <div class="flex items-center gap-6 mb-12">
           <h2 class="text-xs font-black text-neutral-700 uppercase tracking-[0.5em]">{{ cur.proximasBatallas }}</h2>
           <div class="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent"></div>
        </div>
        <div class="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x">
          <div v-for="match in futureMatches" :key="match.id" 
               class="min-w-[400px] p-10 rounded-[64px] bg-[#050505] border border-white/5 hover:border-blue-600/50 transition-all duration-700 group snap-center shadow-3xl">
            <div class="flex justify-between items-center mb-10">
              <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ match.groupName }}</span>
              <span class="text-[10px] font-bold text-neutral-600 uppercase">{{ new Date(match.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) }} • {{ new Date(match.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            <div class="flex items-center justify-between gap-8 mb-10">
              <div class="flex flex-col items-center gap-4 flex-1 cursor-pointer group/team" @click="openTeamDetails(match.homeTeam.name, match.homeTeam.id)">
                <img :src="match.homeTeam.image" class="w-20 h-20 object-contain group-hover/team:scale-110 transition-transform duration-500" />
                <span class="text-xs font-black text-white text-center uppercase italic leading-tight">{{ match.homeTeam.name }}</span>
              </div>
              <span class="text-2xl font-black italic text-neutral-800">VS</span>
              <div class="flex flex-col items-center gap-4 flex-1 cursor-pointer group/team" @click="openTeamDetails(match.awayTeam.name, match.awayTeam.id)">
                <img :src="match.awayTeam.image" class="w-20 h-20 object-contain group-hover/team:scale-110 transition-transform duration-500" />
                <span class="text-xs font-black text-white text-center uppercase italic leading-tight">{{ match.awayTeam.name }}</span>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3 py-4 border-t border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span class="text-[9px] font-black text-neutral-700 uppercase tracking-widest truncate">{{ match.facility || 'Sede por Confirmar' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Data Grid -->
    <section class="py-32">
      <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-12 gap-32">
          
          <!-- Standings -->
          <div class="lg:col-span-8 space-y-20">
            <h3 class="text-6xl font-black italic uppercase text-white tracking-tighter">{{ cur.posiciones }}</h3>

            <div v-if="standingsPending" class="p-40 text-center bg-[#050505] rounded-[80px] border border-white/5">
               <div class="w-20 h-20 border-[8px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-10 shadow-[0_0_50px_rgba(37,99,235,0.2)]"></div>
            </div>

            <div v-else class="bg-[#050505] rounded-[80px] border border-white/5 overflow-hidden shadow-4xl group/table relative">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="text-[11px] font-black text-neutral-600 uppercase tracking-[0.4em] border-b border-white/5 bg-white/[0.01]">
                      <th class="px-12 py-12 w-24">POS</th>
                      <th class="px-4 py-12 min-w-[340px]">{{ cur.equipos }}</th>
                      <th class="px-4 py-12 text-center">PJ</th>
                      <th class="px-4 py-12 text-center">G</th>
                      <th class="px-4 py-12 text-center">E</th>
                      <th class="px-4 py-12 text-center">P</th>
                      <th class="px-12 py-12 text-center bg-blue-600/10 text-blue-500">PTS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr v-for="row in rawStandings" :key="row.team.id" class="hover:bg-white/[0.02] transition-all duration-700 group/row">
                      <td class="px-12 py-12">
                        <span class="text-4xl font-black italic text-neutral-800 group-hover/row:text-blue-600 transition-colors duration-500">{{ row.position }}</span>
                      </td>
                      <td class="px-4 py-12">
                        <div class="flex items-center gap-10 cursor-pointer group/team-info" @click="openTeamDetails(row.team.name, row.team.id)">
                          <div class="w-16 h-16 rounded-3xl bg-neutral-900 p-3 border border-white/5 group-hover/team-info:scale-125 transition-transform duration-700 shadow-2xl">
                            <img :src="row.team.image" class="w-full h-full object-contain" />
                          </div>
                          <div class="flex flex-col">
                            <span class="font-black text-2xl text-white uppercase italic tracking-tighter group-hover/row:translate-x-4 transition-transform duration-700">{{ row.team.name }}</span>
                            <span class="text-[11px] font-bold text-neutral-600 uppercase tracking-widest mt-1">{{ row.team.place }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-12 text-center text-xl font-bold text-neutral-500">{{ row.played }}</td>
                      <td class="px-4 py-12 text-center text-xl font-black text-emerald-500">{{ row.wins }}</td>
                      <td class="px-4 py-12 text-center text-xl font-bold text-neutral-700">{{ row.draws }}</td>
                      <td class="px-4 py-12 text-center text-xl font-bold text-rose-600">{{ row.losses }}</td>
                      <td class="px-12 py-12 text-center font-black text-5xl text-blue-500 bg-blue-600/[0.03]">{{ row.points }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Recent Matches -->
          <div class="lg:col-span-4 space-y-20">
            <h3 class="text-4xl font-black italic uppercase text-white tracking-tighter">{{ cur.cronograma }}</h3>
            
            <div v-if="matchesPending" class="p-24 text-center bg-[#050505] rounded-[64px] border border-white/5 shadow-inner">
               <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl shadow-blue-600/20"></div>
            </div>

            <div v-else-if="!rawMatches?.length" class="p-32 text-center bg-[#050505] rounded-[64px] border border-white/5 border-dashed">
               <p class="text-neutral-700 text-xs font-black uppercase tracking-[0.4em]">{{ cur.sinDatos }}</p>
            </div>

            <div v-else class="grid gap-10">
               <div v-for="match in rawMatches" :key="match.id" 
                    class="p-10 rounded-[64px] bg-[#050505] border border-white/5 hover:border-blue-600/40 transition-all duration-1000 group hover:shadow-4xl">
                  
                  <div class="flex items-center justify-between mb-10 px-4">
                     <span class="text-[11px] font-black text-neutral-700 uppercase tracking-[0.5em]">{{ new Date(match.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) }}</span>
                     <span class="px-4 py-1.5 rounded-full bg-neutral-900 text-[10px] font-black text-blue-500 uppercase tracking-widest border border-white/5 shadow-inner">{{ match.status }}</span>
                  </div>
                  
                  <div class="flex flex-col gap-10">
                     <div class="flex items-center justify-between group/team cursor-pointer" @click="openTeamDetails(match.homeTeam.name, match.homeTeam.id)">
                        <div class="flex items-center gap-6">
                           <img :src="match.homeTeam.image" class="w-12 h-12 object-contain group-hover/team:scale-125 transition-transform duration-700" />
                           <span class="text-xl font-black text-white uppercase italic tracking-tighter group-hover/team:text-blue-500 transition-colors duration-500">{{ match.homeTeam.name }}</span>
                        </div>
                        <span class="text-5xl font-black italic text-white group-hover/team:scale-110 transition-transform">{{ match.homeScore ?? '-' }}</span>
                     </div>
                     
                     <div class="flex items-center justify-between group/team cursor-pointer" @click="openTeamDetails(match.awayTeam.name, match.awayTeam.id)">
                        <div class="flex items-center gap-6">
                           <img :src="match.awayTeam.image" class="w-12 h-12 object-contain group-hover/team:scale-125 transition-transform duration-700" />
                           <span class="text-xl font-black text-white uppercase italic tracking-tighter group-hover/team:text-blue-500 transition-colors duration-500">{{ match.awayTeam.name }}</span>
                        </div>
                        <span class="text-5xl font-black italic text-white group-hover/team:scale-110 transition-transform">{{ match.awayScore ?? '-' }}</span>
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
h1, h2, h3, h4, .font-black { font-family: 'Inter', sans-serif; letter-spacing: -0.06em; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.scrollbar-custom::-webkit-scrollbar { width: 4px; }
.scrollbar-custom::-webkit-scrollbar-track { background: transparent; }
.scrollbar-custom::-webkit-scrollbar-thumb { background: #1d4ed850; border-radius: 10px; }

.animate-pulse-slow {
  animation: pulse-slow 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

@keyframes title-reveal {
  from { opacity: 0; transform: translateY(60px) skewY(8deg); }
  to { opacity: 1; transform: translateY(0) skewY(0deg); }
}

.animate-title {
  animation: title-reveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.shadow-4xl {
  box-shadow: 0 100px 200px -40px rgba(0, 0, 0, 0.9), 0 0 120px -20px rgba(37, 99, 235, 0.08);
}
</style>
