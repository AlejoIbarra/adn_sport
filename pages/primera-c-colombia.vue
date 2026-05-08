<script setup lang="ts">
const { data: featuredData } = await useFetch('/api/sofascore/featured-events')
const { data: infoData } = await useFetch('/api/sofascore/tournament-info')
const { data: eventsData } = await useFetch('/api/sofascore/team-events')
const { data: roundsData } = await useFetch('/api/sofascore/rounds')
const { data: standingsData } = await useFetch('/api/sofascore/standings')

// Estados Reactivos
const selectedGroupIdx = ref(0)
const viewMode = ref('single') // 'single' or 'all'
const matchStatusFilter = ref('all') // 'all', 'played', 'upcoming'
const selectedRound = ref(0) // 0 means "current/all"

// Persistencia de filtros en localStorage
onMounted(() => {
  const savedViewMode = localStorage.getItem('primeraC_viewMode')
  const savedGroupIdx = localStorage.getItem('primeraC_selectedGroupIdx')
  
  if (savedViewMode === 'all' || savedViewMode === 'single') {
    viewMode.value = savedViewMode as 'all' | 'single'
  }
  
  if (savedGroupIdx !== null) {
    const idx = parseInt(savedGroupIdx)
    if (!isNaN(idx) && idx >= 0) {
      selectedGroupIdx.value = idx
    }
  }
})

// Guardar cambios automáticamente
watch([viewMode, selectedGroupIdx], ([newViewMode, newGroupIdx]) => {
  localStorage.setItem('primeraC_viewMode', newViewMode)
  localStorage.setItem('primeraC_selectedGroupIdx', newGroupIdx.toString())
})

// Grupos disponibles
const groups = computed(() => {
  return standingsData.value?.standings?.map((s: any, index: number) => ({
    id: s.id,
    name: s.name,
    index: index
  })) || []
})

const currentGroupName = computed(() => {
  if (viewMode.value === 'all') return 'Todos los Grupos'
  if (!standingsData.value?.standings) return 'Cargando...'
  return standingsData.value.standings[selectedGroupIdx.value]?.name || 'Grupo'
})

// Resultados filtrados y agrupados por Jornada
const filteredMatches = computed(() => {
  if (!eventsData.value?.tournamentTeamEvents || !standingsData.value?.standings) return []
  
  const allEvents: any[] = []
  const tournamentGroups = eventsData.value.tournamentTeamEvents
  
  // Obtener IDs de equipos del grupo seleccionado para un filtrado exacto
  const currentGroup = standingsData.value.standings[selectedGroupIdx.value]
  const groupTeamIds = new Set(currentGroup?.rows?.map((r: any) => r.team.id) || [])
  
  Object.values(tournamentGroups).forEach((groupData: any) => {
    Object.values(groupData).forEach((teamEvents: any) => {
      if (Array.isArray(teamEvents)) {
        teamEvents.forEach(event => {
          // FILTRADO POR EQUIPO (Mucho más fiable que por nombre de torneo)
          const isFromGroup = groupTeamIds.has(event.homeTeam?.id) || groupTeamIds.has(event.awayTeam?.id)
          const matchesContext = viewMode.value === 'all' || isFromGroup
          
          if (matchesContext && !allEvents.find(e => e.id === event.id)) {
            allEvents.push(event)
          }
        })
      }
    })
  })

  let results = [...allEvents]
  
  // Filtrar por Jornada
  if (selectedRound.value > 0) {
    results = results.filter(e => e.roundInfo?.round === selectedRound.value)
  }

  // Filtrar por estado
  if (matchStatusFilter.value === 'played') {
    results = results.filter(e => e.status?.type === 'finished')
  } else if (matchStatusFilter.value === 'upcoming') {
    results = results.filter(e => e.status?.type === 'notstarted' || e.status?.type === 'inprogress')
  }
  
  return results.sort((a, b) => b.startTimestamp - a.startTimestamp)
})

// Helper para obtener el número de ronda de forma robusta
const getEventRound = (event: any) => {
  // 1. Intentar desde propiedades estructuradas
  let r = event.roundInfo?.round || event.round || event.tournament?.round
  
  // 2. Si es 0 o null, intentar extraer del nombre del torneo (ej: "Ronda 5" o "Jornada 5")
  if (!r) {
    const tName = event.tournament?.name || ''
    const match = tName.match(/(Ronda|Jornada)\s+(\d+)/i)
    if (match) r = parseInt(match[2])
  }
  
  // 3. Si sigue siendo 0, intentar desde la descripción del estado o similar
  if (!r) {
    const desc = event.status?.description || ''
    const matchDesc = desc.match(/(Ronda|Jornada)\s+(\d+)/i)
    if (matchDesc) r = parseInt(matchDesc[2])
  }

  return r || 0
}

// Agrupar por Jornada para la navegación y visualización
const rounds = computed(() => {
  const rSet = new Set<number>()
  if (!eventsData.value?.tournamentTeamEvents) return []
  
  Object.values(eventsData.value.tournamentTeamEvents).forEach((groupData: any) => {
    Object.values(groupData).forEach((events: any) => {
      if (Array.isArray(events)) {
        events.forEach(e => {
          const r = getEventRound(e)
          if (r) rSet.add(r)
        })
      }
    })
  })
  return Array.from(rSet).sort((a, b) => a - b)
})

const groupedMatchesByRound = computed(() => {
  const groups: Record<number, any[]> = {}
  
  filteredMatches.value.forEach(match => {
    const round = getEventRound(match)
    if (!groups[round]) groups[round] = []
    groups[round].push(match)
  })
  
  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a)
    .reduce((acc, key) => {
      acc[key] = groups[key]
      return acc
    }, {} as Record<number, any[]>)
})

const featuredEvents = computed(() => featuredData.value?.featuredEvents || [])
const currentRound = computed(() => roundsData.value?.currentRound?.round || 'N/A')
const tournamentInfo = computed(() => infoData.value?.info || {
  goals: 0,
  homeTeamWins: 0,
  awayTeamWins: 0,
  draws: 0,
  numberOfCompetitors: 0,
  season: { name: 'Cargando...' }
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit'
  })
}

// Obtener la forma (últimos 5 resultados) de un equipo de manera dinámica
const getTeamForm = (teamId: number) => {
  if (!eventsData.value?.tournamentTeamEvents) return []
  
  const teamEvents: any[] = []
  const tournamentGroups = eventsData.value.tournamentTeamEvents
  
  Object.values(tournamentGroups).forEach((groupData: any) => {
    Object.values(groupData).forEach((events: any) => {
      if (Array.isArray(events)) {
        events.forEach(event => {
          if ((event.homeTeam?.id === teamId || event.awayTeam?.id === teamId) && event.status?.type === 'finished') {
            if (!teamEvents.find(e => e.id === event.id)) {
              teamEvents.push(event)
            }
          }
        })
      }
    })
  })

  // Ordenar por fecha (más reciente primero) y tomar los últimos 5
  return teamEvents
    .sort((a, b) => b.startTimestamp - a.startTimestamp)
    .slice(0, 5)
    .map(event => {
      const isHome = event.homeTeam.id === teamId
      const homeScore = event.homeScore?.current || 0
      const awayScore = event.awayScore?.current || 0
      
      if (homeScore === awayScore) return 'D'
      if (isHome) {
        return homeScore > awayScore ? 'W' : 'L'
      } else {
        return awayScore > homeScore ? 'W' : 'L'
      }
    })
    .reverse() // Para mostrar de izquierda a derecha (más antiguo a más reciente o viceversa, usualmente más reciente al final)
}

useHead(() => ({
  title: viewMode.value === 'all' 
    ? 'Primera C Colombia 2026 - Tablas de Posiciones y Resultados Globales' 
    : `Primera C Colombia 2026 - ${currentGroupName.value} | Resultados y Posiciones`,
  meta: [
    { 
      name: 'description', 
      content: viewMode.value === 'all'
        ? 'Consulta las tablas de posiciones, resultados en vivo y el calendario completo de la Primera C Colombia 2026 de Difútbol. Cobertura total de todos los grupos regionales.'
        : `Sigue el desempeño del ${currentGroupName.value} en la Primera C Colombia 2026. Estadísticas detalladas, próximos partidos y tabla de posiciones actualizada.`
    },
    { name: 'keywords', content: 'Primera C Colombia, Difútbol, Futbol Aficionado Colombia, Ascenso Colombia, Resultados Primera C, Tabla de posiciones Primera C, Grupos Regionales Difútbol, ADN Deportivo' },
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `ADN Deportivo - Primera C Colombia - ${currentGroupName.value}` },
    { property: 'og:description', content: 'La plataforma más confiable para seguir el fútbol de ascenso en Colombia. Resultados en tiempo real y estadísticas oficiales.' },
    { property: 'og:image', content: 'https://img.sofascore.com/api/v1/unique-tournament/26947/image' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `ADN Deportivo | Primera C Colombia` },
    { name: 'twitter:description', content: 'Sigue cada detalle de la Primera C Colombia 2026. Todos los grupos y equipos en un solo lugar.' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": "Torneo Primera C Colombia 2026",
        "description": "Campeonato nacional de fútbol aficionado organizado por Difútbol.",
        "startDate": "2026-05-01",
        "location": {
          "@type": "Place",
          "name": "Colombia"
        },
        "organizer": {
          "@type": "Organization",
          "name": "Difútbol"
        }
      })
    }
  ]
}))
</script>

<template>
  <main class="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 font-sans selection:bg-blue-500/30">
    <!-- Premium Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b82f615,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_-20%,#3b82f625,transparent_70%)]"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] invert dark:invert-0"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div class="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
            <div class="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 backdrop-blur-md">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {{ tournamentInfo.season.name }}
            </div>
            <div class="px-4 py-1.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 border border-neutral-300/50 dark:border-white/5 text-neutral-600 dark:text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
              Ronda {{ currentRound }}
            </div>
          </div>
          
          <h1 class="text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-600">
            PRIMERA C <br/> <span class="text-blue-600 dark:text-blue-500">COLOMBIA 2026</span>
          </h1>
          
          <p class="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed font-medium mb-12">
            La plataforma definitiva para seguir el camino al profesionalismo. Datos oficiales, estadísticas en tiempo real y cobertura total de todos los grupos.
          </p>

          <!-- Quick Stats Row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            <div v-for="(val, label) in { 'Goles': tournamentInfo.goals, 'Clubes': tournamentInfo.numberOfCompetitors, 'Locales': tournamentInfo.homeTeamWins, 'Empates': tournamentInfo.draws }" :key="label"
                 class="p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-white/5 backdrop-blur-xl transition-all hover:scale-105 duration-300">
              <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{{ label }}</p>
              <p class="text-2xl font-black text-neutral-900 dark:text-white">{{ val }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Group Hub -->
    <section class="pb-32 relative">
      <div class="container mx-auto px-6">
        <div class="flex flex-col gap-10">
          
          <!-- Group Navigator: Elevated Experience -->
          <div class="sticky top-24 z-30 py-6 -mx-6 px-6 bg-[#fafafa]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-y border-neutral-200 dark:border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all duration-500">
            <div class="flex items-center justify-between gap-6">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                </div>
                <div>
                  <h2 class="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Centro de Competición</h2>
                  <p class="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    {{ currentGroupName }}
                    <span v-if="viewMode === 'single'" class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  </p>
                </div>
              </div>

              <!-- View Mode Toggle -->
              <div class="flex bg-neutral-200/50 dark:bg-neutral-800/50 p-1 rounded-2xl border border-neutral-300/50 dark:border-white/5">
                <button @click="viewMode = 'single'" 
                        class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                        :class="viewMode === 'single' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-white shadow-sm' : 'text-neutral-500'">
                  Grupo
                </button>
                <button @click="viewMode = 'all'" 
                        class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                        :class="viewMode === 'all' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-white shadow-sm' : 'text-neutral-500'">
                  Global
                </button>
              </div>
            </div>

            <div class="flex items-center gap-4 flex-wrap">
              <div v-if="viewMode === 'single'" class="relative group/select min-w-[240px]">
                <select 
                  v-model="selectedGroupIdx"
                  class="w-full appearance-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-500/50 transition-all shadow-sm"
                >
                  <option v-for="group in groups" :key="group.id" :value="group.index">
                    {{ group.name }}
                  </option>
                </select>
                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 group-hover/select:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              <!-- Match Status Filter Tabs -->
              <div class="flex bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-1.5 border border-neutral-200 dark:border-white/5">
                <button v-for="f in [{id:'all', n:'Todos'}, {id:'played', n:'Jugados'}, {id:'upcoming', n:'Próximos'}]" :key="f.id"
                        @click="matchStatusFilter = f.id"
                        class="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                        :class="matchStatusFilter === f.id ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'">
                  {{ f.n }}
                </button>
              </div>
            </div>
          </div>

          <!-- Main Dashboard Content -->
          <div class="flex flex-col gap-12">
            
            <!-- Standings Section -->
            <div class="space-y-8">
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div class="flex items-center gap-4">
                  <div class="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                  <h3 class="text-2xl font-black italic uppercase text-neutral-900 dark:text-white">
                    {{ viewMode === 'all' ? 'Tablas de Posiciones Globales' : 'Posiciones del Grupo' }}
                  </h3>
                </div>

                <!-- Legend / Rules -->
                <div class="flex flex-wrap gap-4 px-6 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 backdrop-blur-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span class="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Zona Playoff</span>
                  </div>
                  <div class="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
                  <div class="flex items-center gap-3">
                    <span v-for="(desc, key) in { 'P': 'Jugados', 'W': 'Victorias', 'D': 'Empates', 'L': 'Derrotas', 'GF': 'Goles F', 'GC': 'Goles C', 'DIFF': 'Dif. Goles' }" :key="key"
                          class="text-[8px] font-bold text-neutral-400 uppercase tracking-tighter">
                      <span class="text-neutral-600 dark:text-neutral-300 mr-1">{{ key }}</span> {{ desc }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Grid of Tables (Single or All) -->
              <div :class="viewMode === 'all' ? 'grid md:grid-cols-2 gap-8' : 'grid lg:grid-cols-12 gap-8'">
                <div v-for="(groupData, gIdx) in (viewMode === 'all' ? standingsData?.standings : [standingsData?.standings?.[selectedGroupIdx]])" 
                     :key="gIdx"
                     :class="viewMode === 'single' ? 'lg:col-span-12' : ''"
                     class="bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-white/5 shadow-2xl shadow-neutral-200/20 dark:shadow-none overflow-hidden h-fit transition-all duration-500 hover:border-blue-500/30">
                  
                  <div class="p-6 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/20">
                    <h4 class="text-lg font-black italic uppercase text-blue-600 dark:text-blue-400 leading-none">{{ groupData?.name || 'Grupo' }}</h4>
                    <span class="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{{ groupData?.rows?.length || 0 }} Equipos</span>
                  </div>

                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="text-[9px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100 dark:border-white/5 bg-neutral-50/20 dark:bg-neutral-800/10">
                          <th class="px-6 py-4 w-12">#</th>
                          <th class="px-2 py-4 min-w-[140px]">Equipo</th>
                          <th class="px-2 py-4 text-center">P</th>
                          <th class="px-2 py-4 text-center">W</th>
                          <th class="px-2 py-4 text-center">D</th>
                          <th class="px-2 py-4 text-center">L</th>
                          <th class="px-2 py-4 text-center">GF</th>
                          <th class="px-2 py-4 text-center">GC</th>
                          <th class="px-2 py-4 text-center">DIFF</th>
                          <th class="px-2 py-4 text-left min-w-[100px]">Últimos 5</th>
                          <th class="px-6 py-4 text-center bg-blue-600/5 text-blue-600 dark:text-blue-400 font-black">Pts</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-neutral-100 dark:divide-white/5">
                        <tr v-for="row in groupData?.rows" :key="row.team.id" 
                            class="hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.02] transition-colors group/row relative">
                          <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                              <!-- Dynamic promotion indicator from API -->
                              <div v-if="row.promotion" 
                                   class="w-1.5 h-5 rounded-full shadow-lg"
                                   :style="{ backgroundColor: row.promotion.color || '#10b981' }">
                              </div>
                              <span class="text-xs font-black italic" :class="row.promotion ? 'text-emerald-500' : 'text-neutral-400'">
                                {{ row.position.toString().padStart(2, '0') }}
                              </span>
                            </div>
                          </td>
                          <td class="px-2 py-4" :class="row.promotion ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]' : ''">
                            <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 p-1.5 border border-neutral-200 dark:border-white/5 shadow-sm">
                                <img :src="`https://img.sofascore.com/api/v1/team/${row.team.id}/image`" :alt="`Escudo de ${row.team.name}`" class="w-full h-full object-contain" />
                              </div>
                              <span class="font-bold text-[12px] text-neutral-800 dark:text-neutral-100 truncate max-w-[140px]">{{ row.team.name }}</span>
                            </div>
                          </td>
                          <td class="px-2 py-4 text-center text-[11px] font-bold text-neutral-500">{{ row.matches || 0 }}</td>
                          <td class="px-2 py-4 text-center text-[11px] font-bold text-neutral-700 dark:text-neutral-300">{{ row.wins || 0 }}</td>
                          <td class="px-2 py-4 text-center text-[11px] font-bold text-neutral-700 dark:text-neutral-300">{{ row.draws || 0 }}</td>
                          <td class="px-2 py-4 text-center text-[11px] font-bold text-neutral-700 dark:text-neutral-300">{{ row.losses || 0 }}</td>
                          <td class="px-2 py-4 text-center text-[11px] font-bold text-blue-600/80 dark:text-blue-400/80">{{ row.scoresFor || 0 }}</td>
                          <td class="px-2 py-4 text-center text-[11px] font-bold text-rose-600/80 dark:text-rose-400/80">{{ row.scoresAgainst || 0 }}</td>
                          <td class="px-2 py-4 text-center text-[12px] font-black italic" :class="(row.scoresFor - row.scoresAgainst) >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                            {{ (row.scoresFor - row.scoresAgainst) > 0 ? '+' : '' }}{{ row.scoresFor - row.scoresAgainst }}
                          </td>
                          <td class="px-2 py-4">
                            <div class="flex items-center justify-start gap-1.5">
                              <!-- Dynamic Form Dots -->
                              <div v-for="(res, idx) in getTeamForm(row.team.id)" :key="idx" 
                                   class="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-sm transition-transform hover:scale-110"
                                   :class="res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-500' : 'bg-rose-500'">
                                {{ res }}
                              </div>
                              <div v-if="getTeamForm(row.team.id).length === 0" class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest italic">
                                Sin datos
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 text-center font-black text-sm text-blue-600 dark:text-blue-400 bg-blue-600/[0.05] dark:bg-blue-500/[0.1]">
                            {{ row.points || 0 }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Match Hub: Center Stage -->
            <div class="space-y-8">
              <div class="bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-white/5 p-8 shadow-2xl shadow-neutral-200/20 dark:shadow-none transition-all duration-500">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-neutral-100 dark:border-white/5 gap-6">
                  <div>
                    <h3 class="text-xl font-black italic uppercase text-neutral-900 dark:text-white">Match Hub</h3>
                    <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Calendario y Resultados por Ronda</p>
                  </div>

                  <!-- Jornada Selector -->
                  <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-w-full md:max-w-[400px] lg:max-w-none">
                    <button @click="selectedRound = 0"
                            :class="selectedRound === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'"
                            class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap">
                      Todas
                    </button>
                    <button v-for="r in rounds" :key="r"
                            @click="selectedRound = r"
                            :class="selectedRound === r ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'"
                            class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap">
                      R{{ r }}
                    </button>
                  </div>
                </div>
                
                <div v-if="filteredMatches.length === 0" class="py-32 text-center bg-neutral-50/50 dark:bg-neutral-800/20 rounded-[32px] border-2 border-dashed border-neutral-100 dark:border-white/5">
                  <div class="text-4xl mb-4">🏟️</div>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">No hay eventos para los filtros seleccionados</p>
                </div>

                <div class="space-y-20">
                  <div v-for="(matches, roundNum) in groupedMatchesByRound" :key="roundNum">
                    <!-- Jornada Header -->
                    <div class="flex items-center gap-6 mb-10">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <span class="text-lg font-black italic">R{{ roundNum }}</span>
                        </div>
                        <div class="flex flex-col">
                          <h4 class="text-2xl font-black italic uppercase text-neutral-900 dark:text-white leading-none">Ronda {{ roundNum }}</h4>
                          <span class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{{ matches.length }} Partidos Programados</span>
                        </div>
                      </div>
                      <div class="h-px flex-1 bg-neutral-100 dark:bg-white/5"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      <div v-for="match in matches" :key="match.id"
                           class="group/match relative p-8 rounded-[40px] bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-white/5 transition-all duration-500 hover:scale-[1.02] hover:bg-white dark:hover:bg-neutral-800 hover:shadow-2xl hover:border-blue-500/30 overflow-hidden">
                        
                        <!-- Match Status & Date -->
                        <div class="flex items-center justify-between mb-8 relative z-10">
                          <div class="flex flex-col">
                            <span class="text-[10px] font-black text-neutral-900 dark:text-white uppercase">{{ new Date(match.startTimestamp * 1000).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) }}</span>
                            <span class="text-[9px] font-bold text-neutral-400">{{ new Date(match.startTimestamp * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}</span>
                          </div>
                          
                          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-white/10 shadow-sm">
                            <span v-if="match.status.type === 'inprogress'" class="flex h-1.5 w-1.5 relative">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                            </span>
                            <span class="text-[9px] font-black uppercase tracking-widest" 
                                  :class="match.status.type === 'finished' ? 'text-neutral-400' : 'text-blue-600 dark:text-blue-400'">
                              {{ match.status.type === 'finished' ? 'Finalizado' : match.status.type === 'inprogress' ? 'En Vivo' : 'Próximo' }}
                            </span>
                          </div>
                        </div>

                        <!-- Versus Layout -->
                        <div class="flex flex-col gap-6 relative z-10 mb-8">
                          <!-- Home -->
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4 flex-1 min-w-0">
                              <div class="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 p-2.5 shadow-sm border border-neutral-100 dark:border-white/5 group-hover/match:scale-110 transition-transform duration-500">
                                <img :src="`https://img.sofascore.com/api/v1/team/${match.homeTeam.id}/image`" class="w-full h-full object-contain" />
                              </div>
                              <span class="text-sm font-black truncate text-neutral-800 dark:text-neutral-100 leading-tight">{{ match.homeTeam.name }}</span>
                            </div>
                            <span class="text-3xl font-black italic text-neutral-900 dark:text-white">{{ match.homeScore?.current ?? '-' }}</span>
                          </div>

                          <div class="flex items-center gap-4">
                            <div class="h-px flex-1 bg-neutral-100 dark:bg-white/5"></div>
                            <span class="text-[9px] font-black italic text-neutral-300 dark:text-neutral-600">VS</span>
                            <div class="h-px flex-1 bg-neutral-100 dark:bg-white/5"></div>
                          </div>

                          <!-- Away -->
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4 flex-1 min-w-0">
                              <div class="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 p-2.5 shadow-sm border border-neutral-100 dark:border-white/5 group-hover/match:scale-110 transition-transform duration-500">
                                <img :src="`https://img.sofascore.com/api/v1/team/${match.awayTeam.id}/image`" class="w-full h-full object-contain" />
                              </div>
                              <span class="text-sm font-black truncate text-neutral-800 dark:text-neutral-100 leading-tight">{{ match.awayTeam.name }}</span>
                            </div>
                            <span class="text-3xl font-black italic text-neutral-900 dark:text-white">{{ match.awayScore?.current ?? '-' }}</span>
                          </div>
                        </div>

                        <!-- Tournament Info -->
                        <div v-if="viewMode === 'all'" class="pt-6 border-t border-neutral-100 dark:border-white/5">
                          <span class="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter bg-blue-500/5 px-2.5 py-1.5 rounded-xl">
                            {{ match.tournament.name.replace('Primera C, ', '') }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Activity & Highlights -->
    <section class="py-32 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-white/5 relative overflow-hidden">
      <div class="container mx-auto px-6 relative z-10">
        <div class="grid lg:grid-cols-12 gap-16">
          
          <div class="lg:col-span-8 space-y-24">
            <!-- Global Highlights -->
            <div>
              <div class="flex items-center gap-4 mb-12">
                <div class="w-1.5 h-10 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                <h2 class="text-4xl font-black tracking-tight italic uppercase text-neutral-900 dark:text-white">Highlights Globales</h2>
              </div>

              <div class="grid md:grid-cols-2 gap-8">
                <div v-for="event in featuredEvents" :key="event.id" 
                     class="group relative p-8 rounded-[40px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-500">
                  <div class="flex flex-col items-center gap-8 relative z-10">
                    <div class="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">
                      {{ formatDate(event.startTimestamp) }}
                    </div>
                    
                    <div class="flex items-center justify-between w-full gap-4">
                      <div class="flex-1 flex flex-col items-center gap-4">
                        <div class="w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-xl group-hover:scale-110 transition-transform duration-500 border border-neutral-100 dark:border-white/5">
                          <img :src="`https://img.sofascore.com/api/v1/team/${event.homeTeam.id}/image`" class="w-full h-full object-contain" />
                        </div>
                        <span class="text-[10px] font-black text-center leading-tight uppercase">{{ event.homeTeam.name }}</span>
                      </div>
                      <div class="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black text-[10px] font-black italic rounded-lg">VS</div>
                      <div class="flex-1 flex flex-col items-center gap-4">
                        <div class="w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-xl group-hover:scale-110 transition-transform duration-500 border border-neutral-100 dark:border-white/5">
                          <img :src="`https://img.sofascore.com/api/v1/team/${event.awayTeam.id}/image`" class="w-full h-full object-contain" />
                        </div>
                        <span class="text-[10px] font-black text-center leading-tight uppercase">{{ event.awayTeam.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity Feed -->
            <div>
              <div class="flex items-center justify-between mb-10">
                <div class="flex items-center gap-4">
                  <div class="w-1.5 h-10 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
                  <h2 class="text-3xl font-black tracking-tight italic uppercase text-neutral-900 dark:text-white">Últimas Actividades</h2>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(result, idx) in recentResults" :key="idx" 
                     class="p-5 rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 hover:bg-blue-50/50 dark:hover:bg-blue-500/[0.02] transition-all group">
                  <div class="flex items-center justify-between mb-3 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
                    <span>{{ result.tournament?.name }}</span>
                    <span>{{ result.status?.description }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1">
                      <img :src="`https://img.sofascore.com/api/v1/team/${result.homeTeam.id}/image`" class="w-5 h-5 object-contain" />
                      <span class="text-xs font-bold truncate max-w-[100px]">{{ result.homeTeam.name }}</span>
                    </div>
                    <div class="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-black font-black text-xs italic mx-4 min-w-[60px] text-center">
                      {{ result.homeScore?.current ?? '-' }} - {{ result.awayScore?.current ?? '-' }}
                    </div>
                    <div class="flex items-center gap-2 flex-1 justify-end">
                      <span class="text-xs font-bold truncate max-w-[100px] text-right">{{ result.awayTeam.name }}</span>
                      <img :src="`https://img.sofascore.com/api/v1/team/${result.awayTeam.id}/image`" class="w-5 h-5 object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2: Sidebar -->
          <div class="lg:col-span-4">
            <div class="sticky top-32 space-y-8">
              <div class="p-10 rounded-[48px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl relative overflow-hidden group">
                <div class="relative z-10">
                  <h3 class="text-3xl font-black italic uppercase mb-4 leading-none text-white">ADN <br/> PREMIUM</h3>
                  <p class="text-blue-100 text-sm font-medium leading-relaxed mb-10 opacity-80">Estadísticas exclusivas y alertas personalizadas de tu equipo favorito.</p>
                  <button class="w-full py-5 bg-white text-blue-700 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-transform duration-500 shadow-xl">Suscribirse Ahora</button>
                </div>
                <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              </div>

              <div class="p-8 rounded-[40px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/5">
                <h3 class="text-lg font-black italic uppercase mb-8 text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/5 pb-4">Info Torneo</h3>
                <div class="space-y-6">
                  <div class="flex gap-4 items-start">
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    <p class="text-xs font-medium text-neutral-500 leading-relaxed uppercase tracking-wider">Avalado por DIFUTBOL y la Federación Colombiana de Fútbol.</p>
                  </div>
                  <div class="flex gap-4 items-start">
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    <p class="text-xs font-medium text-neutral-500 leading-relaxed uppercase tracking-wider">Cobertura nacional de más de 20 grupos regionales.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@900&display=swap');

.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

h1, h2, h3, h4, .font-black {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.04em;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
