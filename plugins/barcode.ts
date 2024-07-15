import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill'
import BarcodeScanner from '@undecaf/vue-barcode-scanner'
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(BarcodeScanner)
})
