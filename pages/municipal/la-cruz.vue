
<script setup lang="ts">
useHead({
  title: 'ADN Deportivo la Cruz',
  meta: [
    { name: 'description', content: 'ADN Deportivo landing page website.' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/adn.png' }
  ],
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
