<template>
    <footer class="pt-20 bg-gray-100 dark:bg-body border-t border-gray-200 dark:border-gray-100/20">
        <AtomsContainer class-name="pb-10">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 gap-y-10">
                <div class="col-span-2 md:col-span-4 lg:col-span-2">
                    <NuxtLink to="/" class=" flex items-center gap-2">
                        <img
                            :src="colorMode.value === 'dark' ? '/iconos/adn_white.png' : '/iconos/adn_color.png'"
                            alt="Logo"
                            class="w-24 h-12"
                        />
                    </NuxtLink>

                    <p class="text-gray-600 dark:text-gray-300 pt-6">
                        Sigue la emoción del deporte con ADN Deportivo, tu fuente confiable de noticias,
                        análisis y actualizaciones en tiempo real. Desde el fútbol hasta el baloncesto, cubrimos
                        todos los deportes que amas. 
                    </p>
                </div>

                <BlocksFooterNavBlock title="Enterprise" :links="quickLinks" />
                <BlocksFooterNavBlock title="Ressources" :links="ressourcesLinks" />
                <BlocksFooterNavBlock title="Support" :links="supportLinks" />
                <BlocksFooterNavBlock title="Enterprise" :links="quickLinks" />
            </div>
        </AtomsContainer>
        <div class="py-2 bg-gray-200 dark:bg-[rgb(10,16,29)]">
            <AtomsContainer>
                <div class="flex justify-between items-center gap-5 text-gray-600 dark:text-gray-300">
                    <div class="">
                        &copy; {{ new Date().getFullYear() }} Allright Reserved. Create by <NuxtLink target="_blank"
                            to="https://www.codevs.dev/" class="font-bold text-primary">Codevs</NuxtLink>
                    </div>

                    <div class="flex items-center gap-x-3">
                        <NuxtLink target="_blank" to="#" class="transition hover:!text-primary">

                        </NuxtLink>

                        <NuxtLink target="_blank" to="https://github.com/johnkat-mj" class="transition hover:!text-primary">
                            <!-- Poner iconos ejemplo fb o ig -->
                        </NuxtLink>
                    </div>
                </div>
            </AtomsContainer>
        </div>
    </footer>
</template>

<script lang="ts" setup>

const colorMode = useColorMode()

const quickLinks = [
    {
        href: "#",
        text: "About us"
    },
    {
        href: "#",
        text: "News"
    },
    {
        href: "#",
        text: "Team"
    },
    {
        href: "#",
        text: "Solution"
    }
]
const ressourcesLinks = [
    {
        href: "#",
        text: "Developpers"
    },
    {
        href: "#",
        text: "Integration"
    },
    {
        href: "#",
        text: "Pricing"
    }
]

const supportLinks = [
    {
        href: "#",
        text: "Contact-us"
    },
    {
        href: "#",
        text: "Licence"
    },
    {
        href: "#",
        text: "Terms"
    },
    {
        href: "#",
        text: "FAQ"
    }
]


</script>