<script setup lang="ts">
import { onMounted } from 'vue'

const props = withDefaults(defineProps<{
  adSlot?: string
  adFormat?: string
  adStyle?: string
  responsive?: string
}>(), {
  adSlot: 'default-slot',
  adFormat: 'auto',
  adStyle: 'display: block; min-height: 90px;',
  responsive: 'true'
})

onMounted(() => {
  try {
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (err) {
    console.warn('AdSense block / load error:', err)
  }
})
</script>

<template>
  <ClientOnly>
    <div class="w-full flex justify-center my-8 overflow-hidden">
      <!-- Container limits size nicely and has a light/dark layout wrapper -->
      <div class="w-full max-w-5xl bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl p-3 border border-neutral-200/50 dark:border-white/5 flex flex-col items-center justify-center min-h-[90px] relative">
        <span class="absolute top-1 left-2 text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600 pointer-events-none">Anuncio</span>
        
        <ins class="adsbygoogle w-full"
             :style="props.adStyle"
             data-ad-client="ca-pub-5447355340994052"
             :data-ad-slot="props.adSlot"
             :data-ad-format="props.adFormat"
             :data-full-width-responsive="props.responsive"></ins>
      </div>
    </div>
  </ClientOnly>
</template>
