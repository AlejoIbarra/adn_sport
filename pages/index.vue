<script setup lang="ts">
useHead({
  title: 'ADN Deportivo',
  meta: [
    { name: 'description', content: 'ADN Deportivo landing page website.' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/adn.png' }
  ],
})
</script>
<template>
    <div>
        <SectionsHomeHeroSection/>
        <hr>
        <SectionsStandingsTable/>
        <hr>
        <SectionsStandingsAllMatches/>
        <hr>
        <SectionsStandingsTopScorers/>
        <!-- <SectionsStandingsPlayedMatches/> -->




        <!-- <SectionsHomeLatestPodcast/> -->
        <!-- <SectionsHomePopularPodcasts/> -->
        <SectionsAboutPodux/>
        <SectionsWhyUs/>

        <!-- <SectionsCallToAction/> -->
    </div>
</template>