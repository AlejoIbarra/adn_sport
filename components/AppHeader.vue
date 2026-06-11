<script lang="ts" setup>
import { LEAGUES } from '~/config/leagues'

const navIsOpen = useState('navIsOpen', () => false)
const colorMode = useColorMode()

const otherLeaguesOpen = ref(false)

function toggleNav(event: MouseEvent): void {
    event.preventDefault()
    navIsOpen.value = !navIsOpen.value
}

const navLinks = [
    {
        text: "Inicio",
        href: "/"
    },
    {
        text: "Primera C",
        href: "/soccer/primera-c-colombia"
    },
    {
        text: "Copa del Mundo",
        href: "/soccer/copa-del-mundo"
    }
]

const otherLeagues = LEAGUES.filter(l => l.slug !== 'primera-c-colombia' && l.slug !== 'copa-del-mundo')

</script>
<template>
    <header class="absolute inset-x-0 top-0 py-3 z-50">
        <AtomsContainer class-name="relative">
            <nav class="flex items-center justify-between w-full relative">
                <!-- app logo -->
                <div class="inline-flex relative bg-inherit">
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <ClientOnly>
                        <img
                            :src="colorMode.value === 'dark' ? '/iconos/adn_white.png' : '/iconos/adn_color.png'"
                            alt="Logo"
                            class="w-24 h-12"
                        />
                        </ClientOnly>
                    </NuxtLink>
                </div>
                <div 
                    class="absolute top-full px-5 sm:px-8 md:px-12 lg:px-0 
                    lg:pt-0 lg:top-0 invisible opacity-40 lg:opacity-100 bg-body rounded-xl border border-box-border shadow-lg shadow-box-shadow 
                    lg:border-none lg:shadow-none lg:rounded-none
                    lg:bg-transparent w-full lg:w-max py-6 lg:py-0 lg:visible lg:relative flex 
                    transition-all duration-300 ease-linear origin-top translate-y-6 lg:translate-y-0"
                    :class="navIsOpen?'!visible !opacity-100 !translate-y-0':''">
                    <ul class="text-gray-700 dark:text-gray-100 w-full flex lg:items-center gap-y-4 lg:gap-x-8 flex-col lg:flex-row relative z-50">
                        <AtomsNavLink v-for="navItem in navLinks" :key="navItem.href" :href="navItem.href" :text="navItem.text" @click="navIsOpen = false" />
                        
                        <!-- Dropdown Resto de Torneos -->
                        <li class="relative lg:inline-flex">
                            <button @click="otherLeaguesOpen = !otherLeaguesOpen" 
                                    class="lg:inline-flex items-center gap-2 transition hover:text-primary ease-linear text-lg bg-transparent border-none outline-none font-sans cursor-pointer text-gray-700 dark:text-gray-100 font-medium">
                                <span>Resto de Torneos</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-300" :class="{'rotate-180': otherLeaguesOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <!-- Click Outside Overlay -->
                            <div v-if="otherLeaguesOpen" class="fixed inset-0 z-[60]" @click="otherLeaguesOpen = false"></div>
                            
                            <transition enter-active-class="ease-out duration-300"
                                enter-from-class="transition transform opacity-0 translate-y-4"
                                enter-to-class="transition transform opacity-100 translate-y-0"
                                leave-active-class="transition ease-in duration-200" 
                                leave-from-class="transform opacity-100 translate-y-0"
                                leave-to-class="transform opacity-0 translate-y-4">
                                <div v-if="otherLeaguesOpen" 
                                     class="absolute lg:left-0 right-0 mt-3 p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl z-[70] w-56 flex flex-col gap-1 backdrop-blur-3xl">
                                    <NuxtLink v-for="league in otherLeagues" :key="league.slug" :to="`/soccer/${league.slug}`" 
                                              @click="otherLeaguesOpen = false; navIsOpen = false"
                                              class="px-4 py-2.5 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-all text-left">
                                        {{ league.name }}
                                    </NuxtLink>
                                </div>
                            </transition>
                        </li>
                    </ul>
                </div>

                <div class="flex items-center bg-inherit gap-1 lg:gap-3 min-w-max">
                    <ElementsThemeSwitcher />
                    <div class="hidden lg:flex lg:items-center gap-4">
                        <!-- <AtomsLinkBtn href="#" variant="secondary">
                            Signin
                        </AtomsLinkBtn>
                        <AtomsLinkBtn href="#" variant="primary">
                            Join Us
                        </AtomsLinkBtn> -->
                    </div>

                    <!-- <div class="flex lg:hidden items-center">
                        <ElementsDropDown>
                            <template #trigger>
                                <button
                                    class="outline-none bg-transparent p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </button>
                            </template>
                            <template #content>
                                <ul class="flex flex-col">
                                    <li
                                        class="flex select-none cursor-pointer items-center gap-3 px-2 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-200">
                                        <NuxtLink to="#">
                                            Join-us
                                        </NuxtLink>
                                    </li>

                                    <li
                                        class="flex select-none cursor-pointer items-center gap-3 px-2 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-200">
                                        <NuxtLink to="#">
                                            Signin
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </template>
                        </ElementsDropDown>
                    </div> -->

                    <div class="flex lg:hidden border-l border-box-border pl-2">
                        <button @click="toggleNav" class="outline-none w-7 h-auto flex flex-col relative">
                            <span
                                class="w-6 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 transition-all duration-300 ease-linear"
                                :class="navIsOpen ? 'translate-y-1.5 rotate-[40deg] scale-x-100 ' : ' scale-x-50 origin-left'"></span>
                            <span
                                class="w-6 origin-center  mt-1 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 transition-all duration-300 ease-linear"
                                :class="navIsOpen ? 'scale-x-0 opacity-0' : ''"></span>
                            <span
                                class="w-6 mt-1 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 transition-all duration-300 ease-linear"
                                :class="navIsOpen ? '-translate-y-1.5 -rotate-[40deg] scale-x-100 ' : ' scale-x-75 origin-left'"></span>
                        </button>
                    </div>
                </div>
            </nav>
        </AtomsContainer>
    </header>
</template>