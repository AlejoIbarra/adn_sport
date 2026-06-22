<script setup lang="ts">
useHead({
  title: 'Quiénes Somos - ADN Deportivo',
  meta: [
    { name: 'description', content: 'Conoce más sobre ADN Deportivo, nuestro equipo, nuestra misión y la cobertura de fútbol global y ascenso colombiano.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>

<template>
  <main class="min-h-screen pt-32 pb-20 bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-500">
    <AtomsContainer>
      <div class="max-w-4xl mx-auto bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-[32px] border border-neutral-200 dark:border-white/5 shadow-xl">
        <h1 class="text-4xl md:text-5xl font-black italic uppercase mb-8 tracking-tighter">
          Quiénes <span class="text-blue-600">Somos</span>
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
          Pasión, información y estadísticas en tiempo real.
        </p>

        <div class="space-y-8 text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">Nuestra Misión</h2>
            <p>
              ADN Deportivo nace con la visión de conectar a los apasionados del fútbol con la información más precisa, rápida y completa. Nos especializamos en dar visibilidad tanto al fútbol internacional de élite (Champions League, Premier League, La Liga, Serie A) como al talento emergente y los campeonatos de ascenso locales (Primera C de Colombia y torneos municipales).
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">Lo Que Hacemos</h2>
            <p>
              A través de nuestra plataforma, ofrecemos resultados en vivo, tablas de posiciones detalladas, calendarios de encuentros y estadísticas avanzadas de equipos y jugadores. Integramos sistemas modernos de datos deportivos para brindar una experiencia inmersiva e interactiva a cada usuario.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">Compromiso Editorial</h2>
            <p>
              Creemos firmemente en el juego limpio y la veracidad de la información. Nuestro equipo trabaja continuamente para asegurar que todos los datos presentados en nuestras tablas y reportes de partidos provengan de fuentes oficiales y federaciones autorizadas.
            </p>
          </section>
        </div>
      </div>
    </AtomsContainer>
  </main>
</template>
