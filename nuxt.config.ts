import { nodePolyfills } from 'd:/Front-projects/skrepyhomepage/node_modules/vite-plugin-node-polyfills/dist/index'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import'], // 抑制 @import 弃用警告
        },
      },
    },
    plugins: [
      nodePolyfills({
        include: ['buffer'], // 只 polyfill buffer 即可
      }),
    ],
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/ico',
          href: '/image/favicon.ico',
        },
      ],
    },
  },
})
