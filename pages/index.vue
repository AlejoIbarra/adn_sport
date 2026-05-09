<script setup lang="ts">
import { LEAGUES } from '~/config/leagues'

useHead({
  title: 'ADN Deportivo - Elite Sports Hub',
  meta: [
    { name: 'description', content: 'La plataforma definitiva para el deporte global. Primera C, Champions League, Premier League y más.' },
  ],
})

// Quick fetch for featured matches across all leagues
const featuredLeagues = LEAGUES.filter(l => l.featured)
</script>

<template>
  <main class="min-h-screen bg-[#050505] text-neutral-100 selection:bg-blue-500/30 overflow-hidden">
    <!-- Brutal Hero Section -->
    <section class="relative pt-40 pb-24 lg:pt-56 lg:pb-40">
      <!-- Animated Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_-20%,#3b82f620,transparent_60%)]"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        <div class="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#050505] to-transparent"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div class="px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 animate-fade-in">
            Global Sports Intelligence
          </div>
          
          <h1 class="text-7xl lg:text-[11rem] font-black tracking-tighter mb-12 leading-[0.8] uppercase italic">
            ADN <br/>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-white to-blue-400">DEPORTIVO</span>
          </h1>
          
          <p class="text-xl lg:text-2xl text-neutral-400 max-w-3xl leading-relaxed font-medium mb-16 px-4">
            El pulso del deporte mundial en un solo lugar. Cobertura en tiempo real de las ligas más prestigiosas y el talento local de Colombia.
          </p>

          <div class="flex flex-wrap justify-center gap-6">
            <button class="px-12 py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-widest text-xs hover:scale-105 hover:bg-blue-500 transition-all duration-500 shadow-2xl shadow-blue-500/40">
              Explorar Ligas
            </button>
            <button class="px-12 py-6 bg-neutral-900 border border-white/10 text-white rounded-[32px] font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all duration-500">
              Ver En Vivo
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- League Selector Grid -->
    <section class="py-32 relative border-t border-white/5">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <h2 class="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Competiciones</h2>
            <p class="text-5xl font-black italic uppercase text-white tracking-tighter">Elite <span class="text-neutral-600">Access</span></p>
          </div>
          <p class="text-neutral-500 max-w-xs text-sm font-medium">
            Selecciona una liga para acceder a estadísticas avanzadas, calendarios y resultados oficiales en tiempo real.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CardsLeagueCard v-for="league in LEAGUES" :key="league.id" :league="league" />
        </div>
      </div>
    </section>

    <!-- Highlighted Feature -->
    <section class="py-32 relative bg-blue-600 overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      <div class="container mx-auto px-6 relative z-10">
        <div class="grid lg:grid-cols-2 items-center gap-20">
          <div class="space-y-10">
            <h2 class="text-6xl lg:text-8xl font-black italic uppercase text-white leading-[0.85] tracking-tighter">
              PASIÓN <br/>
              SIN <br/>
              LÍMITES.
            </h2>
            <p class="text-blue-100 text-xl font-medium max-w-lg">
              Desde el ascenso colombiano hasta la Champions League. Llevamos el cubrimiento deportivo a otro nivel con tecnología de datos premium.
            </p>
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <span class="text-xs font-black uppercase tracking-widest text-white mt-4">Únete a la comunidad</span>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-[4/5] rounded-[64px] overflow-hidden border-8 border-white/20 shadow-4xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <img src="/images/4.jpg" alt="Fans" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-10 -left-10 bg-white p-8 rounded-[40px] shadow-2xl transform -rotate-6">
              <p class="text-blue-600 text-4xl font-black italic">+4,000</p>
              <p class="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Seguidores Fieles</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Teaser -->
    <section class="py-40 text-center">
      <div class="container mx-auto px-6">
        <h2 class="text-2xl font-black italic uppercase text-neutral-500 mb-12 tracking-widest opacity-50">ADN DEPORTIVO • 2026</h2>
        <div class="flex justify-center gap-12 flex-wrap">
          <span v-for="tag in ['ESTADÍSTICAS', 'EN VIVO', 'MULTIDEPORTES', 'NOTICIAS']" :key="tag" 
                class="text-[10px] font-black tracking-[0.5em] text-neutral-700 hover:text-blue-500 transition-colors cursor-default">
            {{ tag }}
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@900&display=swap');

.font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
h1, h2, h3, h4, .font-black { font-family: 'Inter', sans-serif; letter-spacing: -0.04em; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>