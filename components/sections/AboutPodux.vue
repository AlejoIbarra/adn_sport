<template>
    <section class="pt-20 md:pt-24">
        <AtomsContainer>
            <div class="grid md:grid-cols-2 gap-10 xl:gap-14 relative">
                <div class="flex md:h-full ">
                    <div
                        class="w-full md:h-full rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border">
                        <img src="/images/9.jpg" alt="Illustratuin about" width="500"
                            class="w-full h-full object-cover rounded-2xl">
                    </div>
                </div>
                <div class="md:py-2 lg:py-4 relative">
                    <div class="absolute right-0 top-0 h-full w-full flex justify-end">
                        <span class="flex opacity-20">
                            <span class="w-16 h-32 rounded-l-full flex bg-primary blur-2xl"></span>
                            <span class="w-16 h-32 rounded-r-full flex bg-[#f88fc2] blur-2xl mt-14"></span>
                        </span>
                    </div>
                    <div class="relative">
                        <AtomsTitle texte="Somos ADN Deportivo" />
                        <p class="text-gray-600 dark:text-gray-300 pt-8">
                            Vuelve la emoción de la Primera C colombiana con transmisión EN VIVO por ADN Deportivo.
                            No te pierdas ni un solo partido, vive cada jugada, cada gol y cada emoción con nosotros.
                        </p>
                        <div class="grid grid-cols-3 gap-4 max-w-lg pt-8">
                            <div
                                class="text-center rounded-xl bg-box-bg shadow-lg shadow-box-shadow border border-box-border p-3">
                                <h3 class="text-gray-800 dark:text-white font-bold text-xl sm:text-2xl lg:text-3xl">+ 45
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Eventos</p>
                            </div>
                            <div
                                class="text-center rounded-xl bg-box-bg shadow-lg shadow-box-shadow border border-box-border p-3">
                                <h3 class="text-gray-800 dark:text-white font-bold text-xl sm:text-2xl lg:text-3xl">+
                                    500</h3>
                                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Seguidores</p>
                            </div>
                            <div
                                class="text-center rounded-xl bg-box-bg shadow-lg shadow-box-shadow border border-box-border p-3">
                                <h3 class="text-gray-800 dark:text-white font-bold text-xl sm:text-2xl lg:text-3xl">+ 5
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Años de experiencia</p>
                            </div>
                        </div>
                        <div class="pt-10 flex">
                            <!-- <AtomsLinkBtn href="#" variant="primary">
                                Know more
                            </AtomsLinkBtn> -->
                        </div>
                    </div>
                </div>
            </div>
        </AtomsContainer>
    </section>
</template>