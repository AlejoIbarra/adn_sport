<template>
  <section
    class="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-transparent"
  >
    <!-- Canvas del confeti -->
    <canvas ref="confettiCanvas" class="absolute inset-0 z-[9999]"></canvas>

    <!-- Tarjeta principal -->
    <div
      ref="card"
      class="relative z-10 backdrop-blur-2xl border rounded-2xl p-12 sm:p-16 shadow-2xl text-center max-w-2xl w-11/12 transition-all duration-700 bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-slate-900/40 dark:to-slate-800/40 border-amber-600/20 dark:border-amber-500/30"
    >
      <!-- Línea dorada superior -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

      <!-- Logo -->
      <img
        :src="`/${campeon.logo}`"
        :alt="campeon.nombre"
        class="w-40 sm:w-48 h-40 sm:h-48 object-contain mx-auto mb-8 drop-shadow-2xl logo-float"
      />

      <!-- Título superior minimalista -->
      <div
        class="text-xs sm:text-sm font-light tracking-[0.3em] uppercase mb-4 opacity-70 text-amber-700 dark:text-amber-400"
      >
        {{ campeon.descripcion }}
      </div>

      <!-- Nombre del equipo -->
      <h2
        class="text-4xl sm:text-5xl font-bold mb-8 uppercase tracking-wider text-gray-900 dark:text-white"
        style="letter-spacing: 0.15em"
      >
        {{ campeon.nombre }}
      </h2>

      <!-- Divider -->
      <div class="flex items-center justify-center mb-8">
        <div class="h-px w-16 bg-gradient-to-r from-transparent to-amber-500"></div>
        <div class="mx-4 text-amber-500 text-xl">★</div>
        <div class="h-px w-16 bg-gradient-to-l from-transparent to-amber-500"></div>
      </div>

      <!-- Jugadores destacados -->
      <h3
        class="text-sm font-light tracking-[0.25em] uppercase mb-6 opacity-70 text-gray-600 dark:text-gray-300"
      >
      </h3>
      <ul class="flex flex-wrap justify-center gap-3">
        <li
          v-for="jugador in campeon.jugadores"
          :key="jugador.nombre"
          class="bg-gradient-to-r px-6 py-2.5 text-sm font-medium tracking-wide border transition-all duration-300 hover:scale-105 from-amber-50 to-amber-100/50 dark:from-amber-500/10 dark:to-amber-600/10 border-amber-300/40 dark:border-amber-500/30 text-amber-900 dark:text-amber-100 hover:border-amber-500/50 dark:hover:border-amber-400/50"
        >
          {{ jugador.nombre }}
        </li>
      </ul>

      <!-- Efecto de brillo sutil -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-amber-500/5 to-transparent"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import gsap from "gsap"
import confetti from "canvas-confetti"

interface Jugador {
  nombre: string
}
interface Campeon {
  nombre: string
  logo: string
  descripcion: string
  jugadores: Jugador[]
}

const props = defineProps<{ campeon: Campeon }>()

const card = ref<HTMLDivElement | null>(null)
const confettiCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  // Animación de entrada suave
  gsap.from(card.value, {
    opacity: 0,
    y: 30,
    duration: 1.5,
    ease: "power3.out"
  })

  // Confeti elegante y espaciado
  const confettiInstance = confetti.create(confettiCanvas.value!, {
    resize: true,
    useWorker: true
  })

  const colors = ["#F59E0B", "#D97706", "#B45309", "#FFFFFF"]

  const shoot = () => {
    confettiInstance({
      particleCount: 2,
      startVelocity: 20,
      spread: 90,
      ticks: 120,
      origin: { x: Math.random(), y: 0 },
      colors,
      shapes: ["circle"],
      scalar: 0.8
    })
  }

  // Confeti más espaciado y sutil
  const interval = setInterval(shoot, 800)

  onBeforeUnmount(() => clearInterval(interval))
})
</script>

<style scoped>
canvas {
  pointer-events: none;
}

/* Sutil animación del logo */
.logo-float {
  animation: subtleFloat 4s ease-in-out infinite;
}

@keyframes subtleFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>