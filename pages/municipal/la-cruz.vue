
<script setup lang="ts">
useHead({
  title: '⚽ ADN Deportivo La Cruz - Resultados y Noticias de Fútbol en La Cruz, Nariño',
  meta: [
    // SEO general
    { name: 'description', content: 'Resultados en vivo, posiciones y noticias de fútbol Campeonatos municipales en La Cruz, Nariño. Cobertura completa de campeonatos municipales y Primera C.' },
    { name: 'keywords', content: 'fútbol La Cruz Nariño, ADN Deportivo La Cruz, Primera C Nariño, campeonato municipal La Cruz, resultados campeonatos municipales' },
    { name: 'author', content: 'ADN Deportivo La Cruz' },

    // Open Graph (Facebook, WhatsApp, LinkedIn)
    { property: 'og:title', content: '⚽ ADN Deportivo La Cruz - Campeonatos la cruz' },
    { property: 'og:description', content: 'Cobertura total de campeonatos municipales y Primera C en La Cruz, Nariño. Resultados, posiciones y noticias actualizadas.' },
    { property: 'og:image', content: 'https://www.adn-deportivo.com/municipios/la-cruz.png' },
    { property: 'og:url', content: 'https://www.adn-deportivo.com/municipal/la-cruz' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '⚽ ADN Deportivo La Cruz - Resultados y Noticias' },
    { name: 'twitter:description', content: 'Fútbol amateur y Primera C en La Cruz, Nariño. Resultados, posiciones y estadísticas.' },
    { name: 'twitter:image', content: 'https://www.adn-deportivo.com/municipios/la-cruz.png' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/adn.png' }
  ],
  script: [
    // Datos estructurados (Google Rich Snippets)
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsOrganization",
        "name": "ADN Deportivo La Cruz",
        "sport": "Soccer",
        "url": "https://www.adn-deportivo.com/municipios/la-cruz",
        "logo": "https://www.adn-deportivo.com/adn.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "La Cruz",
          "addressRegion": "Nariño",
          "addressCountry": "Colombia"
        },
        "description": "Cobertura de resultados, posiciones y noticias del fútbol municipal y Primera C en La Cruz, Nariño."
      })
    }
  ]
})
</script>

<template>
  <section class="py-20">
    <div class="text-center font-sans px-5">
      <h1 class="text-3xl font-bold mb-10 text-white">Alcaldía Municipal La Cruz</h1>
      <SectionsMunicipalDataSection/>
    </div>
  </section>
</template>



<style scoped>
/* Estilos opcionales para esta página */
</style>
