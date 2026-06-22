<script setup lang="ts">
useHead({
  title: 'Términos y Condiciones - ADN Deportivo',
  meta: [
    { name: 'description', content: 'Términos y Condiciones de uso de la plataforma ADN Deportivo.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>

<template>
  <main class="min-h-screen pt-32 pb-20 bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-500">
    <AtomsContainer>
      <div class="max-w-4xl mx-auto bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-[32px] border border-neutral-200 dark:border-white/5 shadow-xl">
        <h1 class="text-4xl md:text-5xl font-black italic uppercase mb-8 tracking-tighter">
          Términos y <span class="text-blue-600">Condiciones</span>
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
          Última actualización: Junio 2026
        </p>

        <div class="space-y-8 text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso, que junto con nuestra política de privacidad gobiernan la relación de ADN Deportivo con usted en relación con este sitio web.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">2. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos, marcas, logos, dibujos, documentación, programas informáticos o cualquier otro elemento susceptible de protección por la legislación de propiedad intelectual o industrial, que sean accesibles en el portal corresponden exclusivamente a ADN Deportivo o a sus legítimos titulares y quedan expresamente reservados todos los derechos sobre los mismos.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">3. Uso Autorizado</h2>
            <p>
              El uso de la información contenida en el portal se limita a fines personales y no comerciales. Queda expresamente prohibida la reproducción, distribución, transmisión, adaptación o modificación, por cualquier medio y en cualquier forma, de los contenidos de este portal sin la autorización previa y por escrito de sus legítimos titulares.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">4. Limitación de Responsabilidad</h2>
            <p>
              ADN Deportivo no garantiza la exactitud, puntualidad, rendimiento, integridad o idoneidad de la información y los materiales encontrados u ofrecidos en este sitio web para cualquier propósito en particular. Usted reconoce que dicha información y materiales pueden contener inexactitudes o errores y excluimos expresamente la responsabilidad por tales inexactitudes o errores en la máxima medida permitida por la ley.
            </p>
          </section>
        </div>
      </div>
    </AtomsContainer>
  </main>
</template>
