export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    ssr: true,
    app: {
        head: {
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes' }
            ],
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