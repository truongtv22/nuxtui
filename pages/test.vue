<template>
  <div>
    <video ref="video" playsinline="" autoplay></video>


  </div>

  </template>

  <script setup>
  const video=ref(null)
  const constrains={
    audio:false,
    video:{
      facingMode:'environment'
    }
  }
  onMounted(()=>{
    try {
        window['BarcodeDetector'].getSupportedFormats()
    } catch {
        window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill
    }
    navigator.mediaDevices.getUserMedia(constrains).then(stream=>{
      video.value.srcObject=stream
    })
  })


</script>