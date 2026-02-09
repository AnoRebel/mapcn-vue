import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-06',
  future: { compatibilityVersion: 5 },
  
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/scripts',
    'nuxt-umami',
    '@nuxtjs/seo',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://mapcn.anorebel.net',
    name: 'mapcn-vue',
    description: 'Beautiful, accessible map components for Vue. Built on MapLibre GL, styled with Tailwind CSS.',
    defaultLocale: 'en',
  },

  ogImage: {
    enabled: false,
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'mapcn-vue',
      logo: '/icon.svg',
      url: 'https://mapcn.anorebel.net',
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  fonts: {
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
    ],
  },

  image: {
    domains: ['images.unsplash.com'],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
    },
  },

  typescript: {
    strict: true,
  },

  alias: {
    '~/lib': fileURLToPath(new URL('./lib', import.meta.url)),
    '~/registry': fileURLToPath(new URL('./registry', import.meta.url)),
  },

  nitro: {
    preset: 'bun',
  },

  umami: {
     id: process.env.NUXT_UMAMI_SITE_ID || "",
     host: "https://umami.anorebel.net",
     autoTrack: true,
     proxy: "cloak",
     // useDirective: true,
     // ignoreLocalhost: true,
     // excludeQueryParams: false,
     // domains: ['cool-site.app', 'my-space.site'],
     // customEndpoint: '/my-custom-endpoint',
     // enabled: false,
     // logErrors: true,
   },
 
   scripts: {
     registry: {
       rybbitAnalytics: {
         scriptInput: {
           src: "https://rybbit.anorebel.net/api/script.js",
         },
         siteId: process.env.NUXT_RYBBIT_SITE_ID || "",
       },
     },
   },

  runtimeConfig: {
    rybbit: {
      siteId: process.env.NUXT_RYBBIT_SITE_ID || "",
    },
    umami: {
      id: process.env.NUXT_UMAMI_SITE_ID || "",
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://mapcn.anorebel.net',
    },
  },
})