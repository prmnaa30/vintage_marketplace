// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-vuefire',
    '@nuxt/image'
  ],

  devtools: {
    enabled: true
  },

  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  ui: {
    colorMode: false
  },

  runtimeConfig: {
    googleApplicationCredentialsJson: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,

    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_VUEFIRE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_VUEFIRE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_VUEFIRE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_VUEFIRE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_VUEFIRE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_VUEFIRE_APP_ID
      },
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.NUXT_PUBLIC_CLOUDINARY_API_KEY
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/products': { ssr: true },
    '/product/[id]': { ssr: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true
    },
    emulators: false,
    config: {
      apiKey: process.env.NUXT_PUBLIC_VUEFIRE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_VUEFIRE_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_VUEFIRE_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_VUEFIRE_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_VUEFIRE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_VUEFIRE_APP_ID
    }
  }
})
