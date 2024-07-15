<template>
  <div>
    <h1>heloo wol</h1>
    <ClientOnly>
      <barcode-scanner  class="barcode-scanner" 
                     :source="camera" 
                     @bcs-scanned="scanned" >
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
                    </barcode-scanner>
    </ClientOnly>
    
                     <h3>Detected barcodes</h3>
        
    <ul>
      <li v-for="(b, i) in barcodes" :key="i">{{ b.rawValue }} ({{ b.format }})</li>
    </ul>
  </div>

  </template>

  <script setup>
import BarcodeScanner from '@undecaf/vue-barcode-scanner'
const camera=ref(null)
const videoSource=ref(null)
const barcodes=ref([])
function scanned(barcodes) {
      barcodes.value = barcodes
    }
onMounted(()=>{
  try {
  (new window['BarcodeDetector']()).getContext('2d')
} catch {
  console.log(1111)
}
  navigator.mediaDevices.getUserMedia({ audio: false, video: true ,facingMode:"environment"})
      .then(stream => {
        camera.value = stream
        videoSource.value=stream
      })
})
</script>