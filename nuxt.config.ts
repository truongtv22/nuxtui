// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', "nuxt-lodash", '@pinia/nuxt','@nuxt/image',],
  plugins:[],
  colorMode: {
    preference: 'system'
  },
  ui: {
    icons: {
      dynamic: true
    }
  },
  nitro: {
    plugins: ['~/server/index.ts']
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    userName: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
})