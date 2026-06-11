<script setup lang="ts">
import { getLeagueBySlug } from '~/config/leagues'

const route = useRoute()
const slug = route.params.slug as string
const leagueConfig = getLeagueBySlug(slug)

if (!leagueConfig) {
  throw createError({ statusCode: 404, statusMessage: 'League not found' })
}

const provider = leagueConfig.apiProvider
const tournamentId = leagueConfig.id
const seasonId = leagueConfig.seasonId
const externalCode = leagueConfig.externalCode

// SEO - powered by leagues.ts metadata
const siteBase = 'https://adndeportivo.com'
const yearLabel = leagueConfig.slug === 'copa-del-mundo' ? '2026' : '2025/26'

const dynamicKeywords = computed(() => {
  if (leagueConfig.slug === 'copa-del-mundo') {
    return 'Copa del Mundo, Copa del Mundo 2026, Mundial 2026, Copa Mundial FIFA 2026, resultados mundial 2026, partidos mundial en vivo, tabla posiciones copa del mundo 2026, goleadores mundial 2026, mundial fifa en vivo, ADN Deportivo'
  }
  return `${leagueConfig.name}, ${leagueConfig.name} ${yearLabel}, resultados ${leagueConfig.name}, tabla de posiciones ${leagueConfig.name}, estadísticas ${leagueConfig.name}, fútbol en vivo, ADN Deportivo`
})

useHead({
  title: `${leagueConfig.name} ${yearLabel} | Resultados, Posiciones y Estadísticas en Vivo | ADN Deportivo`,
  meta: [
    {
      name: 'description',
      content: leagueConfig.seoDescription || `Sigue la ${leagueConfig.name} ${yearLabel} en vivo: resultados de partidos, tabla de posiciones, fixture completo y goleadores actualizados al instante en ADN Deportivo.`
    },
    {
      name: 'keywords',
      content: computed(() => `${dynamicKeywords.value}, ${leagueConfig.seoKeywords || ''}`)
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'ADN Deportivo' },
    { property: 'og:title', content: `${leagueConfig.name} ${yearLabel} | ADN Deportivo` },
    {
      property: 'og:description',
      content: leagueConfig.seoDescription || `Cobertura completa en tiempo real de la ${leagueConfig.name} ${yearLabel} en ADN Deportivo.`
    },
    {
      property: 'og:image',
      content: leagueConfig.ogImage ? `${siteBase}${leagueConfig.ogImage}` : `${siteBase}/og/default.jpg`
    },
    { property: 'og:url', content: `${siteBase}${route.path}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${leagueConfig.name} ${yearLabel} | ADN Deportivo` },
    {
      name: 'twitter:description',
      content: leagueConfig.seoDescription || `Resultados, posiciones y estadísticas de la ${leagueConfig.name} ${yearLabel}.`
    },
    {
      name: 'twitter:image',
      content: leagueConfig.ogImage ? `${siteBase}${leagueConfig.ogImage}` : `${siteBase}/og/default.jpg`
    },
    // Important for Google News & discovery
    { name: 'news_keywords', content: computed(() => `${leagueConfig.name}, ${leagueConfig.seoKeywords || ''}`) },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }
  ],
  link: [
    { rel: 'canonical', href: `${siteBase}${route.path}` }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SportsLeague',
        'name': `${leagueConfig.name} ${yearLabel}`,
        'sport': 'Soccer',
        'competitionClass': leagueConfig.slug === 'copa-del-mundo' ? "Men's National Teams Football" : "Men's Club Football",
        'description': leagueConfig.seoDescription || `Resultados, posiciones y estadísticas en vivo de la ${leagueConfig.name} ${yearLabel}.`,
        'url': `${siteBase}${route.path}`
      })
    }
  ]
})


// I18N Setup
const lang = ref('es')
const t: any = {
  es: {
    heroTitle: leagueConfig.name,
    heroSubtitle: 'Camino a la gloria. Análisis profundo de cada fase, cada partido y cada momento histórico.',
    season: 'TEMPORADA',
    dataCenter: 'Centro de Datos',
    todos: 'Todos',
    jugados: 'Jugados',
    proximos: 'Próximos',
    faseGrupos: 'Fase de Grupos',
    dieciseisavos: 'Dieciseisavos de Final',
    octavos: 'Octavos de Final',
    cuartos: 'Cuartos de Final',
    semis: 'Semifinales',
    tercerPuesto: 'Tercer y Cuarto Puesto',
    final: 'Gran Final',
    eliminatoria: 'Fase Eliminatoria',
    regular: 'Temporada Regular',
    vs: 'VS',
    enVivo: 'En Vivo',
    finalizado: 'Finalizado',
    programado: 'Programado',
    resultadoFinal: 'Resultado Final',
    posiciones: 'Tabla de Posiciones',
    equipos: 'Equipos',
    pts: 'Pts',
    datoDia: 'Dato del Día',
    verTorneo: 'Ver Torneo',
    cronograma: 'Calendario de Partidos',
    sedeOficial: 'Sede Oficial',
    fundado: 'Fundado en',
    capacidad: 'Capacidad',
    ubicación: 'Ubicación'
  },
  en: {
    heroTitle: leagueConfig.name,
    heroSubtitle: 'Path to glory. Deep analysis of every phase, match, and historic moment.',
    season: 'SEASON',
    dataCenter: 'Data Center',
    todos: 'All',
    jugados: 'Played',
    proximos: 'Upcoming',
    faseGrupos: 'Group Stage',
    dieciseisavos: 'Round of 32',
    octavos: 'Round of 16',
    cuartos: 'Quarter Finals',
    semis: 'Semi Finals',
    tercerPuesto: 'Third Place Match',
    final: 'Grand Final',
    eliminatoria: 'Knockout Stage',
    regular: 'Regular Season',
    vs: 'VS',
    enVivo: 'Live',
    finalizado: 'Finished',
    programado: 'Scheduled',
    resultadoFinal: 'Final Score',
    posiciones: 'Standings Table',
    equipos: 'Teams',
    pts: 'Pts',
    datoDia: 'Stat of the Day',
    verTorneo: 'View Tournament',
    cronograma: 'Match Schedule',
    sedeOficial: 'Official Venue',
    fundado: 'Founded in',
    capacidad: 'Capacity',
    ubicación: 'Location'
  }
}

const cur = computed(() => t[lang.value])

// Fetch Data based on Provider
const fetchUrl = (type: string) => {
  if (provider === 'footballdata') {
    if (type === 'standings') return `/api/footballdata/standings?competitionCode=${externalCode}`
    if (type === 'matches') return `/api/footballdata/matches?competitionCode=${externalCode}`
    if (type === 'info') return `/api/footballdata/info?competitionCode=${externalCode}`
    return ''
  } else {
    if (type === 'standings') return `/api/sofascore/standings?tournamentId=${tournamentId}&seasonId=${seasonId}`
    if (type === 'matches') return `/api/sofascore/team-events?tournamentId=${tournamentId}&seasonId=${seasonId}`
    if (type === 'info') return `/api/sofascore/tournament-info?tournamentId=${tournamentId}&seasonId=${seasonId}`
    if (type === 'featured') return `/api/sofascore/featured-events?tournamentId=${tournamentId}`
    return ''
  }
}

const { data: rawStandings } = await useFetch(fetchUrl('standings'))
const { data: rawMatches } = await useFetch(fetchUrl('matches'))
const { data: rawInfo } = await useFetch(fetchUrl('info'))
const { data: featuredData } = provider === 'sofascore' ? await useFetch(fetchUrl('featured')) : { data: ref(null) }

// Reactive states
const selectedGroupIdx = ref(0)
const viewMode = ref('single') 
const matchStatusFilter = ref('all')
const selectedRound = ref(0)
const featuredTeamData = ref<any>(null)

// NORMALIZATION LOGIC
const normalizedStandings = computed(() => {
  if (!rawStandings.value) return []
  
  if (provider === 'footballdata') {
    return rawStandings.value.standings.map((s: any) => ({
      name: s.group ? s.group.replace('_', ' ') : s.type,
      rows: s.table.map((r: any) => ({
        position: r.position,
        team: { id: r.team.id, name: r.team.name, image: r.team.crest },
        matches: r.playedGames,
        wins: r.won,
        draws: r.draw,
        losses: r.lost,
        scoresFor: r.goalsFor,
        scoresAgainst: r.goalsAgainst,
        points: r.points
      }))
    }))
  } else {
    return rawStandings.value?.standings?.map((s: any) => ({
      name: s.name,
      rows: s.rows?.map((r: any) => ({
        position: r.position,
        team: { id: r.team.id, name: r.team.name, image: `https://img.sofascore.com/api/v1/team/${r.team.id}/image` },
        matches: r.matches,
        wins: r.wins,
        draws: r.draws,
        losses: r.losses,
        scoresFor: r.scoresFor,
        scoresAgainst: r.scoresAgainst,
        points: r.points
      }))
    })) || []
  }
})

const normalizedMatches = computed(() => {
  if (!rawMatches.value) return []

  if (provider === 'footballdata') {
    return rawMatches.value.matches.map((m: any) => ({
      id: m.id,
      startTimestamp: new Date(m.utcDate).getTime() / 1000,
      round: m.matchday,
      stage: m.stage,
      group: m.group,
      status: { type: m.status.toLowerCase() === 'finished' ? 'finished' : (m.status.toLowerCase() === 'in_play' || m.status.toLowerCase() === 'live') ? 'inprogress' : 'notstarted' },
      homeTeam: m.homeTeam ? { id: m.homeTeam.id, name: m.homeTeam.name, image: m.homeTeam.crest || `https://img.sofascore.com/api/v1/team/${m.homeTeam.id}/image` } : { id: 0, name: 'Por definir', image: '/iconos/adn_white.png' },
      awayTeam: m.awayTeam ? { id: m.awayTeam.id, name: m.awayTeam.name, image: m.awayTeam.crest || `https://img.sofascore.com/api/v1/team/${m.awayTeam.id}/image` } : { id: 0, name: 'Por definir', image: '/iconos/adn_white.png' },
      homeScore: { current: m.score?.fullTime?.home },
      awayScore: { current: m.score?.fullTime?.away }
    }))
  } else {
    const allEvents: any[] = []
    const tournamentGroups = rawMatches.value?.tournamentTeamEvents || {}
    Object.values(tournamentGroups).forEach((groupData: any) => {
      Object.values(groupData).forEach((teamEvents: any) => {
        if (Array.isArray(teamEvents)) {
          teamEvents.forEach(event => {
            if (!allEvents.find(e => e.id === event.id)) {
              allEvents.push({
                id: event.id,
                startTimestamp: event.startTimestamp,
                round: event.roundInfo?.round || event.round || 0,
                stage: event.tournament?.category?.name === 'Cup' ? 'KNOCKOUT' : 'REGULAR',
                status: event.status,
                homeTeam: event.homeTeam ? { id: event.homeTeam.id, name: event.homeTeam.name, image: `https://img.sofascore.com/api/v1/team/${event.homeTeam.id}/image` } : { id: 0, name: 'Por definir', image: '/iconos/adn_white.png' },
                awayTeam: event.awayTeam ? { id: event.awayTeam.id, name: event.awayTeam.name, image: `https://img.sofascore.com/api/v1/team/${event.awayTeam.id}/image` } : { id: 0, name: 'Por definir', image: '/iconos/adn_white.png' },
                homeScore: event.homeScore,
                awayScore: event.awayScore
              })
            }
          })
        }
      })
    })
    return allEvents
  }
})

const stages = computed(() => {
  const sSet = new Set<string>()
  normalizedMatches.value.forEach(m => {
    if (m.stage) sSet.add(m.stage)
  })
  const order = ['GROUP_STAGE', 'ROUND_OF_32', 'LAST_32', 'ROUND_OF_16', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', '3RD_PLACE', 'THIRD_PLACE', 'FINAL', 'KNOCKOUT', 'REGULAR']
  return Array.from(sSet).sort((a, b) => order.indexOf(a) - order.indexOf(b))
})

const selectedStage = ref('')
watch(stages, (newStages) => {
  if (!selectedStage.value && newStages.length > 0) {
    // 1. Check if any stage has matches in progress
    const inProgressStage = newStages.find(s => 
      normalizedMatches.value.some(m => m.stage === s && m.status.type === 'inprogress')
    )
    if (inProgressStage) {
      selectedStage.value = inProgressStage
      return
    }

    // 2. Check if any stage has finished matches (latest active stage)
    const finishedStage = [...newStages].reverse().find(s =>
      normalizedMatches.value.some(m => m.stage === s && m.status.type === 'finished')
    )
    if (finishedStage) {
      selectedStage.value = finishedStage
      return
    }

    // 3. Fallback to the first stage (e.g. GROUP_STAGE or REGULAR)
    selectedStage.value = newStages[0]
  }
}, { immediate: true })

const filteredMatches = computed(() => {
  let results = [...normalizedMatches.value]
  
  if (selectedStage.value) {
    results = results.filter(e => e.stage === selectedStage.value)
  }

  if (matchStatusFilter.value === 'played') {
    results = results.filter(e => e.status?.type === 'finished')
  } else if (matchStatusFilter.value === 'upcoming') {
    results = results.filter(e => e.status?.type === 'notstarted' || e.status?.type === 'inprogress')
  }
  
  return results.sort((a, b) => b.startTimestamp - a.startTimestamp)
})

const tournamentInfo = computed(() => {
  if (provider === 'footballdata') {
    return {
      season: { name: rawInfo.value?.currentSeason?.startDate.split('-')[0] || leagueConfig.name },
      goals: 0,
      numberOfCompetitors: rawInfo.value?.teams?.length || 0
    }
  } else {
    return rawInfo.value?.info || { season: { name: leagueConfig.name } }
  }
})

// SportsDB Integration
const fetchHighlightTeam = async () => {
  const teamName = normalizedStandings.value?.[0]?.rows?.[0]?.team?.name
  if (teamName) {
    const { data } = await useFetch(`/api/sportsdb/team?name=${encodeURIComponent(teamName)}`)
    if (data.value?.found) {
      featuredTeamData.value = data.value.data
    }
  }
}

watch(normalizedStandings, () => {
  fetchHighlightTeam()
}, { immediate: true })

const stageName = (stage: string) => {
  const names: Record<string, string> = {
    'GROUP_STAGE': cur.value.faseGrupos,
    'ROUND_OF_32': cur.value.dieciseisavos,
    'LAST_32': cur.value.dieciseisavos,
    'ROUND_OF_16': cur.value.octavos,
    'LAST_16': cur.value.octavos,
    'QUARTER_FINALS': cur.value.cuartos,
    'SEMI_FINALS': cur.value.semis,
    '3RD_PLACE': cur.value.tercerPuesto,
    'THIRD_PLACE': cur.value.tercerPuesto,
    'FINAL': cur.value.final,
    'KNOCKOUT': cur.value.eliminatoria,
    'REGULAR': cur.value.regular
  }
  return names[stage] || stage
}
// Matchday pagination: show ONE round at a time
const availableRounds = computed(() => {
  const rounds = new Set<number>()
  filteredMatches.value.forEach(m => { if (m.round) rounds.add(m.round) })
  return Array.from(rounds).sort((a, b) => a - b)
})

const currentRoundIdx = ref(-1)
watch(availableRounds, (rounds) => {
  if (rounds.length > 0 && currentRoundIdx.value === -1) {
    // Buscar la primera jornada que tenga partidos por jugar o en vivo
    const upcomingRoundIdx = rounds.findIndex(r => 
      filteredMatches.value.some(m => m.round === r && (m.status.type === 'notstarted' || m.status.type === 'inprogress'))
    )
    
    if (upcomingRoundIdx !== -1) {
      currentRoundIdx.value = upcomingRoundIdx
    } else {
      // Si todos los partidos han terminado, mostrar la última jornada
      currentRoundIdx.value = rounds.length - 1
    }
  }
}, { immediate: true })

const currentRound = computed(() => availableRounds.value[currentRoundIdx.value] || 0)
const currentRoundMatches = computed(() => {
  if (availableRounds.value.length === 0) {
    return filteredMatches.value
  }
  return filteredMatches.value.filter(m => m.round === currentRound.value)
})
const canPrev = computed(() => currentRoundIdx.value > 0)
const canNext = computed(() => currentRoundIdx.value < availableRounds.value.length - 1)
const goPrev = () => { if (canPrev.value) currentRoundIdx.value-- }
const goNext = () => { if (canNext.value) currentRoundIdx.value++ }

// Team Modal Logic
const isTeamModalOpen = ref(false)
const selectedTeamName = ref<string | null>(null)
const selectedTeamId = ref<number | string | null>(null)

const openTeamDetails = (name: string, id: number | string) => {
  console.log(`[UI EVENT] Opening details for team: ${name} (ID: ${id})`)
  selectedTeamName.value = name
  selectedTeamId.value = id
  isTeamModalOpen.value = true
}
</script>

<template>
  <main class="min-h-screen bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 font-sans selection:bg-blue-500/30">
    <!-- Premium Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b82f625,transparent_70%)]"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
      </div>

      <!-- Language Switcher (Floating) -->
      <div class="absolute top-10 right-10 z-[100] flex gap-2">
        <button @click="lang = 'es'" :class="lang === 'es' ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-500'" class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shadow-sm">ES</button>
        <button @click="lang = 'en'" :class="lang === 'en' ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-500'" class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shadow-sm">EN</button>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div class="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
            <div class="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 backdrop-blur-md">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {{ cur.season }} {{ tournamentInfo.season.name }}
            </div>
          </div>
          
          <h1 class="text-6xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-600 uppercase italic">
            {{ leagueConfig.name }}
          </h1>
          
          <p class="text-lg lg:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium mb-12">
            {{ cur.heroSubtitle }}
          </p>
        </div>
      </div>
    </section>
       <!-- Final Spotlight -->
    <section v-if="selectedStage === 'FINAL' && filteredMatches[0] && filteredMatches[0].homeTeam.id !== 0 && filteredMatches[0].awayTeam.id !== 0" class="relative py-24 mb-32">
      <div class="container mx-auto px-6">
        <div class="relative p-1 rounded-[64px] bg-gradient-to-br from-blue-600 via-blue-400 to-blue-800">
          <div class="bg-black rounded-[60px] p-12 lg:p-24 overflow-hidden relative">
            <div class="absolute inset-0 opacity-20">
              <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500 blur-[120px]"></div>
              <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 blur-[120px]"></div>
            </div>
            
            <div class="relative z-10 text-center space-y-12">
              <h2 class="text-xs font-black tracking-[0.6em] text-blue-500 uppercase">{{ cur.final }}</h2>
              <div class="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
                <div v-if="filteredMatches[0]" class="flex flex-col items-center gap-8 group cursor-pointer" @click="openTeamDetails(filteredMatches[0].homeTeam.name, filteredMatches[0].homeTeam.id)">
                  <div class="w-32 h-32 lg:w-56 lg:h-56 bg-neutral-900 rounded-[48px] p-10 border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center">
                    <img :src="filteredMatches[0].homeTeam.image" 
                          @error="(e) => (e.target as HTMLImageElement).src = '/iconos/adn_white.png'"
                          class="w-full h-full object-contain drop-shadow-2xl" />
                  </div>
                  <span class="text-2xl lg:text-5xl font-black italic uppercase text-white tracking-tighter">{{ filteredMatches[0].homeTeam.name }}</span>
                </div>
                
                <div class="flex flex-col items-center">
                  <div class="text-6xl lg:text-9xl font-black italic text-neutral-800 mb-4 opacity-50">{{ cur.vs }}</div>
                  <div v-if="filteredMatches[0]?.status.type === 'inprogress'" class="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] animate-pulse shadow-lg shadow-blue-500/40">{{ cur.enVivo }}</div>
                  <div v-else-if="filteredMatches[0]?.status.type === 'finished'" class="px-10 py-4 bg-neutral-800 text-neutral-400 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-lg">{{ cur.finalizado }}</div>
                  <div v-else class="px-10 py-4 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-lg">{{ cur.programado }}</div>
                </div>

                <div v-if="filteredMatches[0]" class="flex flex-col items-center gap-8 group cursor-pointer" @click="openTeamDetails(filteredMatches[0].awayTeam.name, filteredMatches[0].awayTeam.id)">
                  <div class="w-32 h-32 lg:w-56 lg:h-56 bg-neutral-900 rounded-[48px] p-10 border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center">
                    <img :src="filteredMatches[0].awayTeam.image" 
                          @error="(e) => (e.target as HTMLImageElement).src = '/iconos/adn_white.png'"
                          class="w-full h-full object-contain drop-shadow-2xl" />
                  </div>
                  <span class="text-2xl lg:text-5xl font-black italic uppercase text-white tracking-tighter">{{ filteredMatches[0].awayTeam.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Hub -->
    <section class="pb-32 relative">
      <div class="container mx-auto px-6">
        <div class="flex flex-col gap-16">
          
          <!-- Phase Navigator -->
          <div class="sticky top-24 z-30 py-8 -mx-6 px-6 bg-neutral-50/90 dark:bg-[#050505]/90 backdrop-blur-2xl border-y border-neutral-200 dark:border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-8 transition-all duration-500">
            <div class="flex items-center gap-8">
              <div class="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 text-white group cursor-pointer hover:rotate-12 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
              </div>
              <div>
                <h2 class="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-2">{{ cur.dataCenter }}</h2>
                <p class="text-3xl font-black text-neutral-900 dark:text-white italic uppercase tracking-tighter">
                  {{ stageName(selectedStage) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide max-w-full">
              <button v-for="stage in stages" :key="stage"
                      @click="selectedStage = stage"
                      class="px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap border"
                      :class="selectedStage === stage ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-neutral-500 hover:border-blue-500/30 shadow-sm dark:shadow-none'">
                {{ stageName(stage) }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-24">
            <!-- Visual Tournament Roadmap / Bracket Progress Graph -->
            <div v-if="stages.length > 1" class="bg-white dark:bg-neutral-900/20 border border-neutral-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm dark:shadow-none overflow-x-auto scrollbar-hide">
              <div class="flex items-center justify-between min-w-[800px] px-6">
                <template v-for="(stage, idx) in stages" :key="stage">
                  <!-- Node -->
                  <button @click="selectedStage = stage" 
                          class="flex flex-col items-center gap-3 group transition-all shrink-0">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center border-2 font-black text-xs transition-all duration-500"
                         :class="selectedStage === stage ? 'bg-blue-600 border-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 group-hover:border-blue-500/40 group-hover:text-neutral-700 dark:group-hover:text-white'">
                      {{ idx + 1 }}
                    </div>
                    <span class="text-[9px] font-black uppercase tracking-[0.15em] transition-colors"
                          :class="selectedStage === stage ? 'text-blue-500' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'">
                      {{ stageName(stage) }}
                    </span>
                  </button>
                  <!-- Connecting Line -->
                  <div v-if="idx < stages.length - 1" class="flex-1 h-0.5 mx-4 transition-all duration-700"
                       :class="stages.indexOf(selectedStage) > idx ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-800'">
                  </div>
                </template>
              </div>
            </div>

            <!-- Full Standings Table (Only if available) -->
            <div v-if="normalizedStandings.length > 0" class="space-y-12">
              <div class="flex items-center justify-between">
                <h3 class="text-3xl font-black italic uppercase text-neutral-900 dark:text-white tracking-tighter">{{ cur.posiciones }}</h3>
                <div v-if="normalizedStandings.length > 1" class="flex bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-white/5">
                   <button v-for="(group, idx) in normalizedStandings" :key="idx"
                           @click="selectedGroupIdx = idx"
                           :class="selectedGroupIdx === idx ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-600 dark:text-neutral-500'"
                           class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all">
                     {{ group.name }}
                   </button>
                </div>
              </div>

              <div class="bg-white dark:bg-neutral-900 rounded-[48px] border border-neutral-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-neutral-200/50 dark:shadow-none">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="text-[10px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-200 dark:border-white/5 bg-neutral-100/50 dark:bg-neutral-800/10">
                        <th class="px-8 py-6 w-16">#</th>
                        <th class="px-4 py-6 min-w-[240px]">{{ cur.equipos }}</th>
                        <th class="px-4 py-6 text-center">PJ</th>
                        <th class="px-4 py-6 text-center text-emerald-500">G</th>
                        <th class="px-4 py-6 text-center text-neutral-400">E</th>
                        <th class="px-4 py-6 text-center text-rose-500">P</th>
                        <th class="px-4 py-6 text-center">GF</th>
                        <th class="px-4 py-6 text-center">GC</th>
                        <th class="px-4 py-6 text-center">DG</th>
                        <th class="px-8 py-6 text-center bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black">PTS</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-200 dark:divide-white/5">
                      <tr v-for="row in normalizedStandings[selectedGroupIdx]?.rows" :key="row.team.id" class="hover:bg-blue-500/[0.03] transition-colors group">
                        <td class="px-8 py-6">
                          <span class="text-sm font-black italic text-neutral-400 dark:text-neutral-600 group-hover:text-blue-500 transition-colors">{{ row.position }}</span>
                        </td>
                        <td class="px-4 py-6">
                          <div class="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity" @click="openTeamDetails(row.team.name, row.team.id)">
                            <img :src="row.team.image" class="w-8 h-8 object-contain" />
                            <span class="font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:translate-x-1 transition-transform">{{ row.team.name }}</span>
                          </div>
                        </td>
                        <td class="px-4 py-6 text-center text-sm font-bold text-neutral-500 dark:text-neutral-400">{{ row.matches }}</td>
                        <td class="px-4 py-6 text-center text-sm font-bold text-emerald-500 dark:text-emerald-400/80">{{ row.wins }}</td>
                        <td class="px-4 py-6 text-center text-sm font-bold text-neutral-400 dark:text-neutral-500">{{ row.draws }}</td>
                        <td class="px-4 py-6 text-center text-sm font-bold text-rose-500 dark:text-rose-400/80">{{ row.losses }}</td>
                        <td class="px-4 py-6 text-center text-sm font-bold text-neutral-500 dark:text-neutral-400">{{ row.scoresFor }}</td>
                        <td class="px-4 py-6 text-center text-sm font-bold text-neutral-500 dark:text-neutral-400">{{ row.scoresAgainst }}</td>
                        <td class="px-4 py-6 text-center text-sm font-black italic" :class="(row.scoresFor - row.scoresAgainst) >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                          {{ (row.scoresFor - row.scoresAgainst) > 0 ? '+' : '' }}{{ row.scoresFor - row.scoresAgainst }}
                        </td>
                        <td class="px-8 py-6 text-center font-black text-lg text-blue-600 dark:text-blue-400 bg-blue-500/[0.02] dark:bg-blue-500/[0.05]">
                          {{ row.points }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <ElementsAdBanner ad-slot="1000000003" />

            <!-- Matches Section -->
            <div class="grid lg:grid-cols-12 gap-16">
              <div class="lg:col-span-8 space-y-8">
                <!-- Round Navigator -->
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-black italic uppercase text-neutral-900 dark:text-white tracking-tighter">{{ cur.cronograma }}</h3>
                  <div class="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-white/5">
                    <button @click="matchStatusFilter = 'all'" :class="matchStatusFilter === 'all' ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-500'" class="px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all">{{ cur.todos }}</button>
                    <button @click="matchStatusFilter = 'played'" :class="matchStatusFilter === 'played' ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-500'" class="px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all">{{ cur.jugados }}</button>
                    <button @click="matchStatusFilter = 'upcoming'" :class="matchStatusFilter === 'upcoming' ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-500'" class="px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all">{{ cur.proximos }}</button>
                  </div>
                </div>

                <!-- Matchday Paginator -->
                <div v-if="availableRounds.length > 0" class="flex items-center justify-between bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-200 dark:border-white/5 px-6 py-4 shadow-sm dark:shadow-none">
                  <button @click="goPrev" :disabled="!canPrev" class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all" :class="canPrev ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-700 cursor-not-allowed'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div class="text-center">
                    <span class="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Jornada</span>
                    <p class="text-4xl font-black italic text-neutral-900 dark:text-white">{{ currentRound }}</p>
                  </div>
                  <button @click="goNext" :disabled="!canNext" class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all" :class="canNext ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-700 cursor-not-allowed'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <!-- Current Round Matches -->
                <div class="space-y-4">
                  <div v-for="match in currentRoundMatches" :key="match.id"
                       class="group flex items-center gap-6 p-6 rounded-3xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 hover:border-blue-500/20 transition-all duration-300 shadow-sm dark:shadow-none">
                    <!-- Date -->
                    <div class="hidden md:flex flex-col items-center w-20 shrink-0">
                      <span class="text-[9px] font-black text-neutral-500 uppercase">{{ new Date(match.startTimestamp * 1000).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'short' }) }}</span>
                      <span class="text-[9px] font-bold text-neutral-600">{{ new Date(match.startTimestamp * 1000).toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' }) }}</span>
                    </div>
                    <!-- Home -->
                    <div class="flex-1 flex items-center justify-end gap-3 cursor-pointer hover:opacity-70 transition-opacity" @click="openTeamDetails(match.homeTeam.name, match.homeTeam.id)">
                      <span class="text-sm font-bold text-neutral-900 dark:text-white text-right">{{ match.homeTeam.name }}</span>
                      <img :src="match.homeTeam.image" class="w-8 h-8 object-contain" />
                    </div>
                    <!-- Score -->
                    <div class="flex items-center gap-3 px-4 py-2 rounded-2xl min-w-[100px] justify-center" :class="match.status.type === 'finished' ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/20 dark:border-blue-500/30'">
                      <span class="text-xl font-black italic text-neutral-950 dark:text-white">{{ match.homeScore?.current ?? '-' }}</span>
                      <span class="text-sm font-black text-neutral-600">:</span>
                      <span class="text-xl font-black italic text-neutral-950 dark:text-white">{{ match.awayScore?.current ?? '-' }}</span>
                    </div>
                    <!-- Away -->
                    <div class="flex-1 flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity" @click="openTeamDetails(match.awayTeam.name, match.awayTeam.id)">
                      <img :src="match.awayTeam.image" class="w-8 h-8 object-contain" />
                      <span class="text-sm font-bold text-neutral-900 dark:text-white">{{ match.awayTeam.name }}</span>
                    </div>
                    <!-- Status -->
                    <div class="hidden md:block w-24 text-right">
                      <span class="text-[9px] font-black uppercase tracking-wider" :class="match.status.type === 'finished' ? 'text-neutral-400 dark:text-neutral-600' : 'text-emerald-400'">
                        {{ match.status.type === 'finished' ? cur.finalizado : match.status.type === 'inprogress' ? cur.enVivo : cur.programado }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sidebar -->
              <div class="lg:col-span-4 space-y-12">
                <div v-if="featuredTeamData" class="p-12 rounded-[48px] bg-gradient-to-br from-blue-50/50 via-white to-neutral-50 dark:from-blue-900/40 dark:via-neutral-900 dark:to-black border border-neutral-200 dark:border-white/10 shadow-4xl dark:shadow-none relative overflow-hidden group">
                  <div class="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                  
                  <img :src="featuredTeamData.badge" class="w-24 h-24 object-contain mb-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
                  <h4 class="text-3xl font-black italic uppercase text-neutral-900 dark:text-white mb-6 leading-none tracking-tighter">{{ cur.datoDia }}</h4>
                  <p class="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-10 font-medium italic">
                    "{{ featuredTeamData.name }} {{ lang === 'es' ? 'se mantiene como el equipo a batir en esta competición.' : 'remains the team to beat in this competition.' }}"
                  </p>
                  
                  <div class="space-y-6 pt-6 border-t border-neutral-200 dark:border-white/5">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{{ cur.sedeOficial }}</span>
                      <span class="text-sm font-bold text-neutral-900 dark:text-white">{{ featuredTeamData.stadium }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{{ cur.capacidad }}</span>
                      <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ Number(featuredTeamData.stadiumCapacity).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ElementsAdBanner ad-slot="1000000005" />

    <!-- Team Details Modal -->
    <ModalsTeamModal 
      :key="selectedTeamId || 'none'"
      :is-open="isTeamModalOpen" 
      :team-id="selectedTeamId"
      :team-name="selectedTeamName" 
      :provider="provider"
      @close="isTeamModalOpen = false; selectedTeamName = null; selectedTeamId = null" 
    />
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@900&display=swap');

.font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
h1, h2, h3, h4, .font-black { font-family: 'Inter', sans-serif; letter-spacing: -0.04em; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
