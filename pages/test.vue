<template>
  <div>
    <p ref="result"></p>
    <div>
      <canvas ref="canvas"></canvas>
      <video ref="video" playsinline="" autoplay></video>
    </div>


  </div>

</template>

<script setup>
const video = ref(null)
const canvas = ref(null),
  detector = ref(null),
  result = ref(null),
  requestId=ref(null)
ctx = canvas.value.getContext('2d')
const constrains = {
  audio: false,
  video: {
    facingMode: 'environment'
  }
}
function detect(source) {
  return detector.value
    .detect(source)
    .then(symbols => {
      if (symbols.length > 0) {
        canvas.value.width = source.naturalWidth || source.videoWidth || source.width
        canvas.value.height = source.naturalHeight || source.videoHeight || source.height
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

        symbols.forEach(symbol => {
          const lastCornerPoint = symbol.cornerPoints[symbol.cornerPoints.length - 1]
          ctx.moveTo(lastCornerPoint.x, lastCornerPoint.y)
          symbol.cornerPoints.forEach(point => ctx.lineTo(point.x, point.y))

          ctx.lineWidth = 3
          ctx.strokeStyle = '#00e000ff'
          ctx.stroke()
          canvas.value.style.position = 'absolute'
          canvas.value.style.top = '0'
        })

        symbols.forEach(symbol => {
          delete symbol.boundingBox
          delete symbol.cornerPoints
        })
        result.value.innerText = JSON.stringify(symbols, null, 2)
      }
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

    })
}
function detectVideo(repeat) {
  if (!repeat) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  if (typeof repeat === 'undefined') {
    repeat = true
  }

  if (repeat) {
    detect(video)
      .then(() => requestId.value = requestAnimationFrame(() => detectVideo(true)))

  } else {
    cancelAnimationFrame(requestId)
    requestId.value = null
  }
}
onMounted(() => {
  try {
    window['BarcodeDetector'].getSupportedFormats()
  } catch {
    window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill
  }
  navigator.mediaDevices.getUserMedia(constrains).then(stream => {
    video.value.srcObject = stream
    detectVideo()
  })
})


</script>