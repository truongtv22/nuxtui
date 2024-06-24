import {z} from 'zod'

export default defineNuxtPlugin((nuxtApp) => {
nuxtApp.vueApp.use(z)
})
