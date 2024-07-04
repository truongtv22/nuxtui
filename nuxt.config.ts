// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', "nuxt-lodash", '@pinia/nuxt', ''],
  plugins:[],
  colorMode: {
    preference: 'system'
  },
  ui: {
    icons: {
      dynamic: true
    }
  },
})