<template>
  <div>
    <p>{{ result}}</p>
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
  requestId=ref(null),
ctx = ref(null)
const constrains = {
  audio: false,
  video: {
    facingMode: 'environment'
  }
}
async function createDetector() {
      const supportedFormats = await BarcodeDetector.getSupportedFormats()
      detector.value = new BarcodeDetector({ formats: supportedFormats, zbar: { encoding: 'utf-8' } })
    }
function detect(source) {
  result.value='222222'
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
        result.value = JSON.stringify(symbols, null, 2)
      }
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

    }).catch(err=>{
      result.value=err
    })
}
function detectVideo(repeat) {
  if (!repeat) {
    ctx.value.clearRect(0, 0, canvas.width, canvas.height)
  }

  if (typeof repeat === 'undefined') {
    repeat = true
  }

  if (repeat) {
    result.value='1111111'
    detect(video.value)
      .then(() => requestId.value = requestAnimationFrame(() => detectVideo(true))).catch(err=>result.value=err)

  } else {
    cancelAnimationFrame(requestId)
    requestId.value = null
  }
}
onMounted(async () => {
  try {
    window['BarcodeDetector'].getSupportedFormats()
  } catch {
    window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill
  }
  result.value=5555555
  ctx.value = canvas.value.getContext('2d')
  result.value=333333
  await createDetector()
  
  navigator.mediaDevices.getUserMedia(constrains).then(stream => {
    video.value.srcObject = stream
    detectVideo()
  })
})


</script>