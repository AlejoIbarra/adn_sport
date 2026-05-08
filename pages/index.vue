<script setup lang="ts">
useHead({
  title: 'ADN Deportivo',
  meta: [
    { name: 'description', content: 'La plataforma oficial para seguir la Primera C Colombia y el fútbol regional.' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/adn.png' }
  ],
})
</script>

<template>
    <div class="bg-[#fafafa] dark:bg-[#050505]">
        <!-- Hero Section -->
        <SectionsHomeHeroSection/>
        
        <!-- Primera C Spotlight -->
        <section class="relative py-24 bg-white dark:bg-neutral-900 border-y border-neutral-100 dark:border-white/5">
            <div class="container mx-auto px-6">
                <div class="flex flex-col lg:flex-row items-center gap-16">
                    <div class="lg:w-1/2">
                        <div class="relative rounded-[48px] overflow-hidden shadow-2xl group">
                            <img src="/images/9.jpg" alt="Cobertura ADN" class="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div class="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                            <div class="absolute bottom-8 left-8 right-8">
                                <p class="text-white text-2xl font-black italic uppercase leading-none">Pasión que nos une</p>
                                <p class="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2">Cubrimiento total en cada estadio</p>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2 space-y-8">
                        <h2 class="text-4xl lg:text-6xl font-black italic uppercase text-neutral-900 dark:text-white tracking-tighter">
                            ¿Por qué elegir <br/>
                            <span class="text-blue-600">ADN Deportivo?</span>
                        </h2>
                        <div class="space-y-6">
                            <div v-for="(item, i) in [
                                { t: 'Veracidad Total', d: 'Información verificada directamente desde las fuentes oficiales de Difútbol y clubes locales.' },
                                { t: 'Transmisiones Pro', d: 'Llevamos la emoción del campo a tu pantalla con calidad profesional y relatos apasionados.' },
                                { t: 'Comunidad Fuerte', d: 'Más de 4,000 seguidores en Nariño y Colombia validan nuestro compromiso diario.' }
                            ]" :key="i" class="flex gap-6 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-white/5 transition-all hover:border-blue-500/30 group">
                                <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span class="text-xl font-black">{{ i + 1 }}</span>
                                </div>
                                <div>
                                    <h4 class="text-lg font-black uppercase italic text-neutral-900 dark:text-white">{{ item.t }}</h4>
                                    <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{{ item.d }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Newsletter / Community Section -->
        <section class="py-24 overflow-hidden relative">
            <div class="absolute inset-0 bg-blue-600"></div>
            <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div class="container mx-auto px-6 relative z-10 text-center">
                <h2 class="text-4xl lg:text-6xl font-black italic uppercase text-white mb-8 tracking-tighter">Únete a la familia <br/> de ADN Deportivo</h2>
                <p class="text-blue-100 text-lg max-w-2xl mx-auto mb-12">
                    Sé parte de los más de **4,000 seguidores** que reciben las últimas noticias, resultados y transmisiones del fútbol colombiano directamente en sus redes.
                </p>
                <div class="flex flex-wrap justify-center gap-6">
                    <a href="https://www.facebook.com/adndeportivon" target="_blank" class="px-10 py-5 bg-white text-blue-600 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-50 transition-all shadow-xl">Síguenos en Facebook</a>
                    <NuxtLink to="/primera-c-colombia" class="px-10 py-5 border-2 border-white/30 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all">Ver Resultados Hoy</NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>