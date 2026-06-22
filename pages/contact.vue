<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'Contacto - ADN Deportivo',
  meta: [
    { name: 'description', content: 'Ponte en contacto con el equipo de ADN Deportivo. Envíanos tus sugerencias, preguntas o propuestas comerciales.' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const name = ref('')
const email = ref('')
const message = ref('')
const sent = ref(false)

const submitForm = () => {
  if (name.value && email.value && message.value) {
    sent.value = true
    name.value = ''
    email.value = ''
    message.value = ''
    setTimeout(() => {
      sent.value = false
    }, 5000)
  }
}
</script>

<template>
  <main class="min-h-screen pt-32 pb-20 bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-500">
    <AtomsContainer>
      <div class="max-w-4xl mx-auto bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-[32px] border border-neutral-200 dark:border-white/5 shadow-xl">
        <h1 class="text-4xl md:text-5xl font-black italic uppercase mb-8 tracking-tighter">
          Contáctanos
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed">
          ¿Tienes preguntas, comentarios, sugerencias de ligas o deseas pautar en nuestro sitio? Escríbenos y te responderemos lo antes posible.
        </p>

        <div class="grid md:grid-cols-2 gap-12 pt-4">
          <!-- Contact Info -->
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-bold text-neutral-900 dark:text-white mb-2">Correo Electrónico</h2>
              <p class="text-neutral-600 dark:text-neutral-300 text-sm">
                contacto@adn-deportivo.com
              </p>
            </div>
            <div>
              <h2 class="text-lg font-bold text-neutral-900 dark:text-white mb-2">Ubicación</h2>
              <p class="text-neutral-600 dark:text-neutral-300 text-sm">
                Nariño, Colombia
              </p>
            </div>
            <div class="pt-4 border-t border-neutral-200 dark:border-white/5">
              <p class="text-xs text-neutral-400">
                ADN Deportivo es un portal informativo independiente y gratuito dedicado al periodismo deportivo y estadísticas futbolísticas.
              </p>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-600 dark:text-neutral-400">Nombre</label>
                <input
                  v-model="name"
                  required
                  type="text"
                  placeholder="Tu nombre"
                  class="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-600 dark:text-neutral-400">Correo Electrónico</label>
                <input
                  v-model="email"
                  required
                  type="email"
                  placeholder="correo@ejemplo.com"
                  class="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-600 dark:text-neutral-400">Mensaje</label>
                <textarea
                  v-model="message"
                  required
                  rows="4"
                  placeholder="Escribe tu mensaje..."
                  class="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all text-sm resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                class="w-full py-3 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-600/20 text-sm"
              >
                Enviar Mensaje
              </button>

              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform -translate-y-2 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
              >
                <div v-if="sent" class="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-xs font-semibold text-center">
                  ¡Mensaje enviado con éxito! Te contactaremos pronto.
                </div>
              </Transition>
            </form>
          </div>
        </div>
      </div>
    </AtomsContainer>
  </main>
</template>
