<template>
  <div>
    <h1>heloo wol1</h1>
    <ClientOnly>
      <video
          ref="videoSource"
          crossorigin="anonymous"
          muted
          autoplay
          playsinline
          controls
          controlslist="nodownload nofullscreen"
        >
        </video>

    </ClientOnly>
    
                     <h3>Detected barcodes</h3>
        
    <ul>
      <li v-for="(b, i) in barcodes" :key="i">{{ b.rawValue }} ({{ b.format }})</li>
    </ul>
  </div>

  </template>

  <script setup>
//import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill'
const camera=ref(null)
const videoSource=ref(null)
const barcodes=ref([])
function scanned(barcodes) {
      barcodes.value = barcodes
    }
onMounted(()=>{
  try {
  (new window['BarcodeDetector']()).getContext('2d')
  console.log(22222)
} catch {
  //window['BarcodeDetector'] = BarcodeDetectorPolyfill
}
  navigator.mediaDevices.getUserMedia({ audio: false, video: true ,facingMode:"environment"})
      .then(stream => {
        camera.value = stream
        videoSource.value.srcObject=stream
        videoSource.value.play()
      })
})
</script>