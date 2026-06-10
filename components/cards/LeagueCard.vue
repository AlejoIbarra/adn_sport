<script setup lang="ts">
import type { LeagueConfig } from '~/types/sports'

defineProps<{
  league: LeagueConfig
}>()
</script>

<template>
  <NuxtLink :to="`/soccer/${league.slug}`" 
            class="group relative block p-8 rounded-[48px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 shadow-lg shadow-neutral-200/50 dark:shadow-none">
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
    
    <div class="relative z-10">
      <div class="flex items-center justify-between mb-12">
        <div class="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-3 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-neutral-200 dark:border-white/5">
          <img :src="`https://img.sofascore.com/api/v1/unique-tournament/${league.sofaId || league.id}/image`" 
               :alt="league.name" 
               class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col items-end">
          <span class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Activo</span>
          <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>
      
      <h3 class="text-3xl font-black italic uppercase leading-none text-neutral-900 dark:text-white mb-4 group-hover:translate-x-2 transition-transform duration-500">
        {{ league.name }}
      </h3>
      
      <p class="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-10">
        {{ league.country || 'Internacional' }} • Fútbol
      </p>
      
      <div class="flex items-center gap-3 text-blue-400 group-hover:gap-5 transition-all duration-500">
        <span class="text-[10px] font-black uppercase tracking-[0.2em]">Ver Torneo</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </div>
  </NuxtLink>
</template>
