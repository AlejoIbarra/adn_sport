<script setup lang="ts">
import { ref, onMounted } from 'vue'

const consent = ref(true) // Start as true to prevent server-side render flashing

onMounted(() => {
  const cookieConsent = localStorage.getItem('cookie-consent')
  if (!cookieConsent) {
    consent.value = false
  }
})

const acceptConsent = () => {
  localStorage.setItem('cookie-consent', 'accepted')
  consent.value = true
}

const rejectConsent = () => {
  localStorage.setItem('cookie-consent', 'rejected')
  consent.value = true
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="transform translate-y-20 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-20 opacity-0"
  >
    <div
      v-if="!consent"
      class="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-2xl z-[9999] flex flex-col gap-4"
    >
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-500/10 text-blue-500 rounded-2xl shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V5a2 2 0 00-2-2H4a2 2 0 00-2 2v6a15 15 0 003.54 9.61l.092.113m14.076-13.266l-1.985-.284A2 2 0 0116 8.948V11a14 14 0 01-1.927 7.07l-.113.193m-4.004-4.004a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-neutral-900 dark:text-white text-base">Control de Cookies</h3>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
            Utilizamos cookies para personalizar el contenido, analizar nuestro tráfico y servir anuncios a través de Google AdSense. Al hacer clic en "Aceptar todo", consientes el uso de estas tecnologías de acuerdo con nuestra
            <NuxtLink to="/privacy-policy" class="text-blue-500 hover:underline font-semibold">Política de Privacidad</NuxtLink>.
          </p>
        </div>
      </div>
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          @click="rejectConsent"
          class="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Rechazar
        </button>
        <button
          @click="acceptConsent"
          class="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-600/20"
        >
          Aceptar todo
        </button>
      </div>
    </div>
  </Transition>
</template>
