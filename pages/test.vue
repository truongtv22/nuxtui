<template>
  <div>
    <p>{{ result}}</p>
    <div style="position: relative;width: 1000px;height: 1000px;">
    
      <canvas style="position: absolute;top:0;right:0px;width:100%" ref="canvas"></canvas>
      
      <video v-if="display.video" ref="video" playsinline="" autoplay></video>
      <img v-for="item in arr" :src="item" />
    </div>


  </div>

</template>

<script setup>
  const arr=ref([])
  const display=ref({
    video:true,
    image:false
  })
const video = ref(null)
  const image=ref(null)
const canvas = ref(null),
  detector = ref(null),
  result = ref(null),
  requestId=ref(null),
ctx = ref(null)
const constrains = {
  audio: false,
  video: {
    width:1000,
    height:1000,
    facingMode: 'environment'
  }
}
async function createDetector() {
      const supportedFormats = await BarcodeDetector.getSupportedFormats()
      detector.value = new BarcodeDetector({ formats: supportedFormats, zbar: { encoding: 'utf-8' } })
    }
function detect(source) {
  return detector.value
    .detect(source)
    .then(symbols => {
      console.log(symbols)
      if (symbols.length > 0) {
        canvas.value.width = source.naturalWidth || source.videoWidth || source.width
        canvas.value.height = source.naturalHeight || source.videoHeight || source.height
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
        const pro=new Promise((resolve,reject)=>{
          symbols.forEach((symbol,i) => {
            const lastCornerPoint = symbol.cornerPoints[symbol.cornerPoints.length - 1]
            ctx.value.moveTo(lastCornerPoint.x, lastCornerPoint.y)
            symbol.cornerPoints.forEach(point => ctx.value.lineTo(point.x, point.y))

            ctx.value.lineWidth = 3
            ctx.value.strokeStyle = '#00e000ff'
            ctx.value.stroke()
            canvas.value.style.position = 'absolute'
            canvas.value.style.top = '0'
            if(i==symbols.length-1){
              resolve()
            }
          })
        })
        pro.then(res=>{
          
          const promise=new Promise((resolve,reject)=>{
            if(symbols.length>1){
              var w = video.value.videoWidth;
              var h = video.value.videoHeight;
              var canvas1 = document.createElement('canvas');
              canvas1.width = w;
              canvas1.height = h;
              var ctx1 = canvas1.getContext('2d');
              ctx1.drawImage(video.value, 0, 0, w, h);
              var data = canvas1.toDataURL("image/jpg");
              arr.value.push(data)
              detectVideo(false)
              display.value.video=false 
              resolve()
            }
            else{
              resolve()
            }
          })
          promise.then(rs=>{
            symbols.forEach(symbol => {
              delete symbol.boundingBox
              delete symbol.cornerPoints
            })
            result.value = JSON.stringify(symbols)
          })
        })
      }
      else {
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
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
  ctx.value = canvas.value.getContext('2d')
  await createDetector()
  /*
  navigator.mediaDevices.getUserMedia(constrains).then(stream => {
    video.value.srcObject = stream
    detectVideo()
  })
    */
})

</script>