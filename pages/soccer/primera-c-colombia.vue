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
    grupoActual: 'GRUPO ACTUAL',
    goleadores: 'TOP ARTILLEROS'
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
    grupoActual: 'CURRENT GROUP',
    goleadores: 'TOP SCORERS'
  }
}

const cur = computed(() => t[lang.value])

// Data Fetching
const { data: fcfGroups, pending: groupsPending } = await useFetch(`/api/fcf/competition?id=${tournamentId}`)
const { data: futureMatches, pending: futurePending } = await useFetch(`/api/fcf/future-matches?id=${tournamentId}`)
const { data: scorers, pending: scorersPending } = await useFetch(`/api/fcf/scorers?id=${tournamentId}`)

const currentGroupId = ref(null)
const isGroupMenuOpen = ref(false)
const selectedRound = ref<string | null>(null)

const { data: rawStandings, pending: standingsPending } = await useFetch(() => 
  currentGroupId.value ? `/api/fcf/standings?groupId=${currentGroupId.value}` : null
)

const { data: rawMatches, pending: matchesPending } = await useFetch(() => 
  currentGroupId.value ? `/api/fcf/matches?groupId=${currentGroupId.value}` : null
)

// Persistence and Initialization
onMounted(() => {
  const saved = localStorage.getItem('primera_c_group')
  if (saved) {
    currentGroupId.value = saved
  }
})

// Initialize group ID if not set by persistence
watch(fcfGroups, (newData) => {
  if (newData?.competitionElements?.[0]?.id && !currentGroupId.value) {
    currentGroupId.value = newData.competitionElements[0].id
  }
}, { immediate: true })

// Group matches by round
const matchesByRound = computed(() => {
  if (!rawMatches.value) return {}
  const grouped = rawMatches.value.reduce((acc: any, match: any) => {
    const r = match.round || '1'
    if (!acc[r]) acc[r] = []
    acc[r].push(match)
    return acc
  }, {})
  
  return grouped
})

const sortedRounds = computed(() => {
  return Object.keys(matchesByRound.value).sort((a, b) => Number(a) - Number(b))
})

// Automatically set selected round based on the day of the week
watch(matchesByRound, (newVal) => {
  if (!newVal || Object.keys(newVal).length === 0) return
  
  const now = new Date()
  const day = now.getDay() // 0 Sun, 1 Mon, 2 Tue, 3 Wed...
  const rounds = Object.keys(newVal).sort((a, b) => Number(a) - Number(b))
  
  let latestPlayed = rounds[0]
  let firstFuture = rounds[rounds.length - 1]
  
  rounds.forEach(r => {
    const hasPlayed = newVal[r].some((m: any) => m.status === 'PLAYED')
    const hasFuture = newVal[r].some((m: any) => m.status === 'SCHEDULED' || m.status === 'LIVE')
    if (hasPlayed) latestPlayed = r
    if (hasFuture && firstFuture === rounds[rounds.length - 1]) firstFuture = r
  })

  // If Monday (1) or Tuesday (2), show latest played round
  // Otherwise (Wed-Sun), show first future round
  if (day === 1 || day === 2) {
    selectedRound.value = latestPlayed
  } else {
    selectedRound.value = firstFuture
  }
}, { immediate: true })

const currentGroupName = computed(() => {
  const g = fcfGroups.value?.competitionElements?.find((e: any) => e.id === currentGroupId.value)
  return g ? g.name.split(' /')[0] : 'Seleccionar'
})

// SEO Implementation
useHead({
  title: computed(() => {
    const groupSuffix = currentGroupName.value && currentGroupName.value !== 'Seleccionar' ? ` - ${currentGroupName.value}` : '';
    return `Primera C Colombia 2026 | Resultados, Posiciones y Goleadores${groupSuffix} | ADN Deportivo`;
  }),
  meta: [
    { name: 'description', content: computed(() => {
      const groupText = currentGroupName.value && currentGroupName.value !== 'Seleccionar' ? ` del ${currentGroupName.value}` : '';
      return `Sigue la Primera C del fútbol colombiano en vivo. Tablas de posiciones${groupText}, calendario de partidos, resultados en tiempo real y estadísticas de goleadores en ADN Deportivo.`;
    }) },
    { name: 'keywords', content: 'Primera C Colombia, Primera C colombiana, primera c difutbol, fútbol de ascenso Colombia, primera c pasto, primera c ipiales, primera c tumaco, primera c nariño, primera c la cruz, primeraa c colombia, resultados primera c colombia, tabla de posiciones primera c, goleadores primera c, ADN Deportivo, liga de ascenso colombiana' },
    { property: 'og:title', content: computed(() => {
      const groupSuffix = currentGroupName.value && currentGroupName.value !== 'Seleccionar' ? ` - ${currentGroupName.value}` : '';
      return `Primera C Colombia 2026${groupSuffix}`;
    }) },
    { property: 'og:description', content: 'Resultados en vivo, estadísticas, tablas de todos los grupos y toda la pasión de la Primera C colombiana en ADN Deportivo.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `https://adndeportivo.com${route.path}` },
    { property: 'og:image', content: 'https://adndeportivo.com/og-primera-c.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Primera C Colombia | ADN Deportivo' },
    { name: 'twitter:description', content: 'El centro de estadísticas en vivo más completo de la Primera C del fútbol colombiano.' }
  ],
  link: [
    { rel: 'canonical', href: `https://adndeportivo.com${route.path}` }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SportsLeague',
        'name': 'Primera C Colombia',
        'sport': 'Soccer',
        'competitionClass': "Men's Association Football",
        'description': 'Estadísticas, tablas de clasificación por grupos, goleadores y resultados de la Primera C del fútbol amateur de ascenso en Colombia, organizada por Difútbol.',
        'url': 'https://adndeportivo.com/soccer/primera-c-colombia'
      })
    }
  ]
})

// Group matches by date within the selected round
const groupedMatchesByDate = computed(() => {
  if (!selectedRound.value || !matchesByRound.value[selectedRound.value]) return {}
  
  return matchesByRound.value[selectedRound.value].reduce((acc: any, match: any) => {
    const dateStr = new Date(match.date).toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(match)
    return acc
  }, {})
})

// Detection of teams on Bye (Descanso)

// Detection of teams on Bye (Descanso)
const teamsOnByeByRound = computed(() => {
  if (!rawStandings.value || !matchesByRound.value) return {}
  
  const allTeams = rawStandings.value.map((s: any) => s.team)
  const byes: any = {}
  
  Object.keys(matchesByRound.value).forEach(round => {
    const matches = matchesByRound.value[round]
    const teamsPlaying = new Set()
    matches.forEach((m: any) => {
      if (m.homeTeam?.id) teamsPlaying.add(m.homeTeam.id)
      if (m.awayTeam?.id) teamsPlaying.add(m.awayTeam.id)
    })
    
    const onBye = allTeams.filter((t: any) => !teamsPlaying.has(t.id))
    if (onBye.length > 0) {
      byes[round] = onBye
    }
  })
  
  return byes
})

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
  localStorage.setItem('primera_c_group', id)
  isGroupMenuOpen.value = false
  selectedRound.value = null // Reset round when group changes
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

// Scorers state
const showAllScorers = ref(false)
const displayedScorers = computed(() => {
  if (showAllScorers.value) return scorers.value
  return scorers.value?.slice(0, 5)
})

// Search team state and logic
const { data: allTeams } = await useFetch<any[]>(() => `/api/fcf/all-teams?id=${tournamentId}`)
const searchQuery = ref('')
const isSearchResultsOpen = ref(false)

const filteredSearchTeams = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  return allTeams.value?.filter((t: any) => t.name.toLowerCase().includes(q)) || []
})

const handleSelectSearchedTeam = (team: any) => {
  selectGroup(team.groupId)
  searchQuery.value = ''
  isSearchResultsOpen.value = false
}

// Standings filtering for "Descansa"
const filteredStandings = computed(() => {
  if (!rawStandings.value) return []
  return rawStandings.value.filter((row: any) => {
    const name = row.team?.name?.toLowerCase() || ''
    return !name.includes('descansa') && !name.includes('libre')
  })
})
</script>

<template>
  <main class="min-h-screen bg-neutral-50 dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-blue-600/50 overflow-x-hidden transition-colors duration-500">
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
         <h1 class="text-8xl lg:text-[14rem] font-black tracking-tighter mb-12 italic leading-[0.75] uppercase bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-700 animate-title">
           {{ cur.heroTitle }}<br/>
           <span class="text-blue-600">COLOMBIA</span>
         </h1>
         <p class="text-xl lg:text-3xl text-neutral-600 dark:text-neutral-500 max-w-4xl mx-auto leading-relaxed font-bold italic">
           {{ cur.heroSubtitle }}
         </p>
      </div>
    </section>

    <!-- Interactive Group Command Center -->
    <section class="sticky top-24 z-50 py-6 bg-neutral-50/60 dark:bg-black/60 backdrop-blur-3xl border-y border-neutral-200 dark:border-white/5 transition-colors duration-500">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 relative z-[70]">
            <div class="relative">
              <button @click="isGroupMenuOpen = !isGroupMenuOpen; isSearchResultsOpen = false" 
                      class="flex items-center gap-6 px-8 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[24px] hover:border-blue-600/50 transition-all group relative overflow-hidden shadow-sm dark:shadow-none w-full">
                <div class="absolute inset-0 bg-blue-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div class="flex flex-col items-start relative z-10">
                  <span class="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{{ cur.grupoActual }}</span>
                  <span class="text-2xl font-black text-neutral-900 dark:text-white italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{{ currentGroupName }}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" 
                     class="w-6 h-6 text-neutral-700 group-hover:text-blue-400 transition-all duration-500" 
                     :class="{'rotate-180': isGroupMenuOpen}"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- Team Search Input -->
            <div class="relative flex-1 sm:w-[280px]">
              <div class="flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[24px] shadow-sm dark:shadow-none focus-within:border-blue-500/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="searchQuery" 
                       @focus="isSearchResultsOpen = true; isGroupMenuOpen = false"
                       placeholder="Buscar equipo..." 
                       class="w-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none font-bold" />
                <button v-if="searchQuery" @click="searchQuery = ''" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <!-- Autocomplete Results Dropdown -->
              <transition name="dropdown">
                <div v-if="isSearchResultsOpen && filteredSearchTeams.length > 0"
                     class="absolute top-full left-0 mt-3 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[24px] shadow-xl p-4 max-h-[300px] overflow-y-auto z-[80] scrollbar-custom">
                  <ul class="flex flex-col gap-1">
                    <li v-for="team in filteredSearchTeams" :key="team.id"
                        @click="handleSelectSearchedTeam(team)"
                        class="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-all">
                      <span>{{ team.name }}</span>
                      <span class="text-[9px] opacity-65">{{ team.groupName }}</span>
                    </li>
                  </ul>
                </div>
              </transition>
              <div v-if="isSearchResultsOpen" class="fixed inset-0 z-[-1]" @click="isSearchResultsOpen = false"></div>

              <!-- Advanced Interactive Dropdown -->
              <transition name="dropdown">
                <div v-if="isGroupMenuOpen" 
                     class="absolute top-full left-0 mt-6 w-[320px] md:w-[600px] lg:w-[800px] bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-10 z-[60] overflow-hidden">
                  <div class="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#1d4ed810,transparent_50%)]"></div>
                  
                  <div class="relative z-10">
                    <h3 class="text-xs font-black text-neutral-600 uppercase tracking-[0.4em] mb-8">{{ cur.seleccionarGrupo }}</h3>
                    <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-custom">
                      <button v-for="group in fcfGroups?.competitionElements" :key="group.id"
                              @click="selectGroup(group.id)"
                              :class="currentGroupId === group.id ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-500 border-neutral-200 dark:border-white/5 hover:border-blue-600/50 hover:text-neutral-900 dark:hover:text-white'"
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
          <div v-if="!standingsPending && rawStandings?.length" class="hidden lg:flex items-center gap-12 px-10 py-4 bg-neutral-100 dark:bg-white/5 rounded-full border border-neutral-200 dark:border-white/5 backdrop-blur-xl">
             <div class="flex flex-col">
                <span class="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Líder</span>
                <span class="text-sm font-black text-neutral-900 dark:text-white italic uppercase tracking-tighter">{{ rawStandings[0].team.name }}</span>
             </div>
             <div class="w-px h-8 bg-neutral-200 dark:bg-white/10"></div>
             <div class="flex flex-col">
                <span class="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Goles</span>
                <span class="text-sm font-black text-neutral-900 dark:text-white italic tracking-tighter">{{ rawStandings[0].goalsFor }}</span>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Match Radar -->
    <section v-if="futureMatches?.length" class="py-16 overflow-hidden">
      <div class="container mx-auto px-6">
         <div class="flex items-center gap-6 mb-12">
            <h2 class="text-xs font-black text-neutral-400 uppercase tracking-[0.5em]">{{ cur.proximasBatallas }}</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-neutral-200 dark:from-neutral-800 to-transparent"></div>
         </div>
        <div class="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x">
          <div v-for="match in futureMatches" :key="match.id" 
               class="min-w-[400px] p-10 rounded-[64px] bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/5 hover:border-blue-600/50 transition-all duration-700 group snap-center shadow-lg dark:shadow-3xl">
            <div class="flex justify-between items-center mb-10">
              <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">{{ match.groupName }}</span>
              <span class="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">{{ new Date(match.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) }} • {{ new Date(match.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            <div class="flex items-center justify-between gap-8 mb-10">
              <div class="flex flex-col items-center gap-4 flex-1 cursor-pointer group/team" @click="openTeamDetails(match.homeTeam.name, match.homeTeam.id)">
                <img :src="match.homeTeam.image" class="w-20 h-20 object-contain group-hover/team:scale-110 transition-transform duration-500" :alt="match.homeTeam.name" />
                <span class="text-xs font-black text-neutral-900 dark:text-white text-center uppercase italic leading-tight">{{ match.homeTeam.name }}</span>
              </div>
              <span class="text-2xl font-black italic text-neutral-300 dark:text-neutral-800">VS</span>
              <div class="flex flex-col items-center gap-4 flex-1 cursor-pointer group/team" @click="openTeamDetails(match.awayTeam.name, match.awayTeam.id)">
                <img :src="match.awayTeam.image" class="w-20 h-20 object-contain group-hover/team:scale-110 transition-transform duration-500" :alt="match.awayTeam.name" />
                <span class="text-xs font-black text-neutral-900 dark:text-white text-center uppercase italic leading-tight">{{ match.awayTeam.name }}</span>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3 py-4 border-t border-neutral-200 dark:border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-neutral-500 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span class="text-[9px] font-black text-neutral-600 dark:text-neutral-700 uppercase tracking-widest truncate">{{ match.facility || 'Sede por Confirmar' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Data Grid & SEO Optimized Sections -->
    <section class="py-8 lg:py-12 bg-neutral-50 dark:bg-black transition-colors duration-500" aria-label="Estadísticas y Cronograma">
      <div class="container mx-auto px-4 lg:px-6 space-y-16 lg:space-y-32">
        
        <!-- Standings Table (Semantic Section) -->
        <section id="posiciones" class="space-y-8 lg:space-y-12">
            <header class="flex items-end justify-between border-b border-neutral-200 dark:border-white/5 pb-8">
               <h2 class="text-4xl lg:text-6xl font-black italic uppercase text-neutral-900 dark:text-white tracking-tighter leading-none">{{ cur.posiciones }}</h2>
               <span class="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em] mb-2">Grupo Actual: {{ currentGroupName }}</span>
            </header>

            <div v-if="standingsPending" class="p-40 text-center bg-neutral-200/50 dark:bg-neutral-900/20 rounded-[80px] border border-neutral-200 dark:border-white/5">
               <div class="w-20 h-20 border-[8px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl"></div>
            </div>

            <article v-else class="bg-white dark:bg-[#050505] rounded-[64px] lg:rounded-[80px] border border-neutral-200 dark:border-white/5 overflow-hidden shadow-2xl dark:shadow-4xl group/table relative">
              <div class="overflow-x-auto scrollbar-custom">
                <table class="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr class="text-[11px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.4em] border-b border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/[0.01]">
                      <th class="px-12 py-10 w-24">POS</th>
                      <th class="px-4 py-10 min-w-[340px]">{{ cur.equipos }}</th>
                      <th class="px-4 py-10 text-center">PJ</th>
                      <th class="px-4 py-10 text-center">G</th>
                      <th class="px-4 py-10 text-center">E</th>
                      <th class="px-4 py-10 text-center">P</th>
                      <th class="px-12 py-10 text-center bg-blue-600/10 text-blue-500 font-black">PTS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-neutral-200 dark:divide-white/5">
                    <tr v-for="row in filteredStandings" :key="row.team.id" class="hover:bg-blue-600/[0.02] transition-all duration-700 group/row">
                      <td class="px-12 py-10">
                        <span class="text-4xl font-black italic text-neutral-300 dark:text-neutral-800 group-hover/row:text-blue-600 transition-colors duration-500">{{ row.position }}</span>
                      </td>
                      <td class="px-4 py-10">
                        <div class="flex items-center gap-8 cursor-pointer group/team-info" @click="openTeamDetails(row.team.name, row.team.id)">
                          <div class="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-2.5 border border-neutral-200 dark:border-white/5 group-hover/team-info:scale-110 transition-transform duration-700 shadow-lg">
                            <img :src="row.team.image" class="w-full h-full object-contain" :alt="row.team.name" />
                          </div>
                          <div class="flex flex-col">
                            <span class="font-black text-xl text-neutral-900 dark:text-white uppercase italic tracking-tighter group-hover/row:translate-x-2 transition-transform duration-700 leading-none">{{ row.team.name }}</span>
                            <span class="text-[10px] font-bold text-neutral-500 dark:text-neutral-600 uppercase tracking-widest mt-1">{{ row.team.place }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-10 text-center text-lg font-bold text-neutral-600 dark:text-neutral-500">{{ row.played }}</td>
                      <td class="px-4 py-10 text-center text-lg font-black text-emerald-500">{{ row.wins }}</td>
                      <td class="px-4 py-10 text-center text-lg font-bold text-neutral-400 dark:text-neutral-700">{{ row.draws }}</td>
                      <td class="px-4 py-10 text-center text-lg font-bold text-rose-600">{{ row.losses }}</td>
                      <td class="px-12 py-10 text-center font-black text-4xl text-blue-600 dark:text-blue-500 bg-blue-600/[0.01] dark:bg-blue-600/[0.03]">{{ row.points }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
        </section>

        <ElementsAdBanner ad-slot="1000000004" />

        <!-- Schedule & Scorers Column Grid -->
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          <!-- Match Schedule (Semantic Section) -->
          <section id="calendario" class="lg:col-span-7 space-y-12">
            <h2 class="text-4xl lg:text-5xl font-black italic uppercase text-neutral-900 dark:text-white tracking-tighter leading-none">{{ cur.cronograma }}</h2>
            
            <div v-if="matchesPending" class="p-24 text-center bg-white dark:bg-[#050505] rounded-[64px] border border-neutral-200 dark:border-white/5 shadow-inner">
               <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>

            <div v-else-if="!rawMatches?.length" class="p-32 text-center bg-white dark:bg-[#050505] rounded-[64px] border border-neutral-200 dark:border-white/5 border-dashed">
               <p class="text-neutral-500 dark:text-neutral-700 text-xs font-black uppercase tracking-[0.4em]">{{ cur.sinDatos }}</p>
            </div>

            <div v-else class="space-y-12">
               <!-- Round Selector -->
               <nav class="bg-white dark:bg-neutral-900/50 rounded-[40px] p-8 border border-neutral-200 dark:border-white/5 shadow-sm dark:shadow-none" aria-label="Selección de Jornada">
                  <h4 class="text-[9px] font-black text-neutral-500 dark:text-neutral-600 uppercase tracking-[0.4em] mb-6 px-2">Jornadas Disponibles</h4>
                  <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-custom">
                     <button v-for="round in sortedRounds" :key="round"
                             @click="selectedRound = round"
                             :class="selectedRound === round ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20 scale-105' : 'bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/5 hover:border-blue-600/50'"
                             class="aspect-square flex items-center justify-center rounded-2xl border transition-all duration-300 font-black italic text-sm">
                        {{ round }}
                     </button>
                  </div>
               </nav>
               
               <!-- Matches List -->
               <div class="space-y-12 animate-fade-in" :key="selectedRound">
                  <div v-for="(matches, date) in groupedMatchesByDate" :key="date" class="space-y-6">
                     <div class="flex items-center gap-4 px-6">
                        <span class="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic">{{ date }}</span>
                        <div class="h-px flex-1 bg-neutral-200 dark:bg-white/5"></div>
                     </div>

                     <div class="grid gap-4">
                        <article v-for="match in matches" :key="match.id">
                           <!-- If match contains a descansando team -->
                           <div v-if="match.homeTeam.name.toLowerCase().includes('descansa') || match.awayTeam.name.toLowerCase().includes('descansa')"
                                class="relative p-6 rounded-[30px] bg-neutral-100/50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-white/5 flex items-center justify-between gap-4">
                             <div class="flex items-center gap-4">
                               <div class="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 p-2 border border-neutral-300 dark:border-white/5 flex items-center justify-center">
                                 <img :src="match.homeTeam.name.toLowerCase().includes('descansa') ? match.awayTeam.image : match.homeTeam.image" class="w-full h-full object-contain" :alt="match.homeTeam.name.toLowerCase().includes('descansa') ? match.awayTeam.name : match.homeTeam.name" />
                               </div>
                               <span class="text-sm font-black text-neutral-900 dark:text-white uppercase italic">{{ match.homeTeam.name.toLowerCase().includes('descansa') ? match.awayTeam.name : match.homeTeam.name }}</span>
                             </div>
                             <div class="px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest">
                               Descansa
                             </div>
                           </div>

                           <!-- Regular Match Card -->
                           <div v-else
                                class="relative p-6 rounded-[40px] bg-white dark:bg-[#080808] border border-neutral-200 dark:border-white/5 hover:border-blue-600/30 transition-all duration-700 group shadow-sm dark:shadow-none flex items-center justify-between gap-4">
                              <div class="flex-1 flex flex-col items-center gap-3 cursor-pointer group/team" @click="openTeamDetails(match.homeTeam.name, match.homeTeam.id)">
                                 <div class="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-2 border border-neutral-200 dark:border-white/5">
                                    <img :src="match.homeTeam.image" class="w-full h-full object-contain" :alt="match.homeTeam.name" />
                                 </div>
                                 <span class="text-[9px] font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter text-center leading-tight">{{ match.homeTeam.name }}</span>
                              </div>

                              <div class="flex flex-col items-center justify-center min-w-[100px]">
                                 <div class="flex items-center gap-3 mb-1">
                                    <span class="text-3xl font-black italic text-neutral-950 dark:text-white tracking-tighter">{{ match.homeScore ?? '-' }}</span>
                                    <span class="text-xs font-black text-neutral-400 dark:text-neutral-800 italic">:</span>
                                    <span class="text-3xl font-black italic text-neutral-950 dark:text-white tracking-tighter">{{ match.awayScore ?? '-' }}</span>
                                 </div>
                                 
                                 <div v-if="match.halfScore" class="mb-1 px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                                    <span class="text-[6px] font-black text-neutral-500 uppercase tracking-widest">MT: {{ match.halfScore }}</span>
                                 </div>

                                 <div class="flex items-center gap-1.5">
                                    <div v-if="match.status === 'LIVE'" class="w-1 h-1 bg-red-600 rounded-full animate-ping"></div>
                                    <span :class="match.status === 'LIVE' ? 'text-red-500' : 'text-neutral-500'" 
                                          class="text-[7px] font-black uppercase tracking-widest">{{ match.status }}</span>
                                 </div>
                                 <time class="text-[7px] font-bold text-neutral-600 mt-0.5">{{ new Date(match.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) }}</time>
                              </div>

                              <div class="flex-1 flex flex-col items-center gap-3 cursor-pointer group/team" @click="openTeamDetails(match.awayTeam.name, match.awayTeam.id)">
                                 <div class="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-2 border border-neutral-200 dark:border-white/5">
                                    <img :src="match.awayTeam.image" class="w-full h-full object-contain" :alt="match.awayTeam.name" />
                                 </div>
                                 <span class="text-[9px] font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter text-center leading-tight">{{ match.awayTeam.name }}</span>
                              </div>
                           </div>
                        </article>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <!-- Top Scorers (Semantic Section) -->
          <section id="goleadores" class="lg:col-span-5 space-y-12">
            <h2 class="text-4xl lg:text-5xl font-black italic uppercase text-neutral-900 dark:text-white tracking-tighter leading-none">{{ cur.goleadores }}</h2>
            
            <div v-if="scorersPending" class="p-24 text-center bg-white dark:bg-[#050505] rounded-[64px] border border-neutral-200 dark:border-white/5 shadow-inner">
               <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>

            <div v-else class="grid gap-4">
               <article v-for="(scorer, index) in displayedScorers" :key="scorer.player.id" 
                    :class="index === 0 ? 'p-6 bg-blue-600/10 border-blue-600/30 ring-1 ring-blue-600/20' : 'p-4 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 shadow-sm dark:shadow-none'"
                    class="flex items-center justify-between rounded-[32px] border hover:border-blue-600/50 transition-all group relative overflow-hidden">
                  
                  <div v-if="index === 0" class="absolute top-0 right-0 p-4 opacity-10">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>

                  <div class="flex items-center gap-4 relative z-10">
                     <div class="relative">
                        <div :class="index === 0 ? 'w-16 h-16' : 'w-12 h-12'" class="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-black shadow-2xl">
                           <img :src="scorer.player.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" :alt="scorer.player.name" />
                        </div>
                        <span :class="index === 0 ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'" 
                              class="absolute -top-1 -left-1 w-6 h-6 text-[9px] font-black flex items-center justify-center rounded-lg shadow-2xl italic">
                           {{ index + 1 }}
                        </span>
                     </div>
                     <div class="flex flex-col">
                        <span :class="index === 0 ? 'text-xl' : 'text-base'" class="font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1 group-hover:text-blue-400 transition-colors">{{ scorer.player.shortName }}</span>
                        <div class="flex items-center gap-2">
                           <div class="w-4 h-4 rounded-md bg-neutral-100 dark:bg-black p-0.5 border border-neutral-200 dark:border-white/5">
                              <img :src="scorer.team.image" class="w-full h-full object-contain" :alt="scorer.team.name" />
                           </div>
                           <span class="text-[8px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest leading-none">{{ scorer.team.name }}</span>
                        </div>
                     </div>
                  </div>
                  <div class="flex flex-col items-end relative z-10">
                     <span :class="index === 0 ? 'text-4xl' : 'text-2xl'" class="font-black italic text-blue-600 leading-none mb-1">{{ scorer.goals }}</span>
                     <span class="text-[7px] font-black text-neutral-700 uppercase tracking-widest">Goles</span>
                  </div>
               </article>

               <!-- View More Button -->
               <button v-if="scorers?.length > 5" 
                       @click="showAllScorers = !showAllScorers"
                       class="w-full py-6 mt-4 rounded-[32px] border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 hover:border-blue-600/50 transition-all group flex items-center justify-center gap-4 shadow-sm dark:shadow-none">
                  <span class="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 group-hover:text-white transition-colors">
                     {{ showAllScorers ? 'Ver Menos Top' : 'Ver Todos los Goleadores' }}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       class="w-5 h-5 text-neutral-700 group-hover:text-blue-400 transition-all" 
                       :class="{'rotate-180': showAllScorers}"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
               </button>
            </div>
          </section>
        </div>
      </div>
    </section>

    <ElementsAdBanner ad-slot="1000000006" />

    <!-- Modal -->
    <ModalsTeamModal 
      :key="selectedTeamId || 'none'"
      :is-open="isTeamModalOpen" 
      :team-id="selectedTeamId"
      :team-name="selectedTeamName" 
      provider="fcf"
      @close="isTeamModalOpen = false; selectedTeamName = null; selectedTeamId = null" 
    />
    <!-- SEO Explanatory Content Section (Crawling fuel) -->
    <section class="py-16 bg-neutral-100/50 dark:bg-neutral-900/10 border-t border-neutral-200 dark:border-white/5 transition-colors duration-500" aria-label="Información Primera C">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="space-y-8">
          <h2 class="text-3xl font-black italic uppercase text-neutral-900 dark:text-white tracking-tighter">
            Todo sobre la Primera C del Fútbol Colombiano
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-medium">
            La <strong>Primera C colombiana</strong> es la máxima categoría del fútbol aficionado y de ascenso en el país, organizada por la <strong>Difútbol</strong> (División Aficionada del Fútbol Colombiano). Este certamen reúne a clubes de todas las regiones de Colombia que compiten a través de grupos zonales para ganarse un lugar en las fases eliminatorias nacionales.
          </p>
          <div class="grid md:grid-cols-2 gap-8 pt-4">
            <div class="space-y-4">
              <h3 class="text-lg font-bold italic uppercase text-neutral-900 dark:text-white">Formato de Competición y Ascenso</h3>
              <p class="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                El campeonato consta de múltiples grupos organizados geográficamente. Los clubes juegan partidos de ida y vuelta en su zona, y los clasificados ingresan a llaves de eliminación directa hasta definir al campeón de la Primera C nacional.
              </p>
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-bold italic uppercase text-neutral-900 dark:text-white">ADN Deportivo: Tu Portal de Resultados en Vivo</h3>
              <p class="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                Ofrecemos la plataforma más completa de estadísticas del fútbol amateur colombiano: resultados de partidos al instante, tablas de posiciones dinámicas de todos los grupos y el ranking oficial de goleadores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
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

.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
