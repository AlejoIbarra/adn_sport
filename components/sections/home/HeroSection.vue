<template>
    <section class="relative w-full mb-4">
        <div class="absolute top-0 inset-x-0 h-64 flex items-start">
            <div
                class="h-24 w-2/3 bg-gradient-to-br from-primary opacity-20 blur-2xl dark:from-[#570cac] dark:invisible dark:opacity-40">
            </div>
            <div
                class="h-20 w-3/5 bg-gradient-to-r from-[#8cd66a] opacity-40 blur-2xl dark:from-[#670ccf] dark:opacity-40">
            </div>
        </div>
        <AtomsContainer class-name="relative">
            <div aria-hidden="true" class="absolute inset-y-0 w-44 left-0 hidden dark:flex">
                <div
                    class="h-full md:h-1/2 lg:h-full w-full bg-gradient-to-tr opacity-40 dark:blur-2xl dark:from-[#570cac] dark:opacity-20">
                </div>
            </div>
            <div
                class="grid lg:grid-cols-2 gap-10 xl:gap-14 relative pt-24 lg:max-w-none max-w-2xl md:max-w-3xl mx-auto">
                <div class="lg:py-6 text-center lg:text-left">
                    <div class="space-y-6">
                        <span class="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">Somos ADN Deportivo</span>
                        <h1 class="text-gray-800 dark:text-white font-black text-5xl md:text-6xl lg:text-7xl italic uppercase leading-[0.9] tracking-tighter">
                            ADN <br> <span class="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-500">Deportivo</span>
                        </h1>
                    </div>

                    <p class="text-gray-600 dark:text-gray-300 pt-8 mx-auto lg:mx-0 max-w-xl text-lg leading-relaxed">
                        Vuelve la emoción de la **Primera C colombiana** con transmisión **EN VIVO** por ADN Deportivo. No te pierdas ni un solo partido, vive cada jugada, cada gol y cada emoción con nosotros.
                    </p>

                    <div class="flex items-center gap-3 pt-9 flex-col sm:flex-row sm:w-max sm:mx-auto lg:mx-0">
                        <NuxtLink
                            to="/primera-c-colombia"
                            class="px-8 py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95"
                        >
                            Ver Torneo Primera C
                        </NuxtLink>
                    </div>

                    <div class="pt-12 lg:pt-16">
                        <div class="grid grid-cols-3 gap-8">
                            <div class="text-center lg:text-left">
                                <p class="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">+45</p>
                                <p class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Eventos</p>
                            </div>
                            <div class="text-center lg:text-left">
                                <p class="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">+4,000</p>
                                <p class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Seguidores</p>
                            </div>
                            <div class="text-center lg:text-left">
                                <p class="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">+5</p>
                                <p class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Años EXP</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:h-full hidden md:flex">
                    <div class="flex w-full h-96 min-h-[24rem] lg:min-h-[none] lg:w-full lg:h-full items-center relative">
                        <div class="absolute z-0 top-1/2 -translate-y-1/2 w-5/6 right-0 h-[calc(80%+20px)] bg-gradient-to-tr opacity-25 from-primary to-pink-300 dark:from-[#570cac] dark:to-primary blur-2xl"></div>
                        <div class="absolute w-3/5 h-full z-10 p-1 -translate-y-1/2 top-1/2 right-3 rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border">
                            <img src="/images/8.jpg" alt="In studio" width="500" height="auto" loading="lazy" class="w-full h-full rounded-2xl object-cover">
                        </div>
                        <div class="absolute -translate-y-1/2 top-1/2 h-[calc(80%-2rem)] w-[calc(40%-20px)] p-1 rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border ">
                            <img src="/images/4.jpg" alt="Happy in studio" width="200" height="auto" loading="lazy" class="w-full h-full rounded-2xl object-cover">
                        </div>
                    </div>
                </div>
            </div>
        </AtomsContainer>
    </section>
</template>