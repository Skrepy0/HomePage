// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    ssr: true,
    app: {
        head: {
            link: [
                {
                    rel: 'icon',
                    type: 'image/ico',
                    href: '/image/favicon.ico',
                }
            ]
        }
    }
})
