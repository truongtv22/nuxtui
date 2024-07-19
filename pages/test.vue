<template>
  <div>
    <p>{{ result }}</p>
    <p>{{ JSON.stringify(conrs) }}</p>
    <audio ref="audioE" :src="sound" controls></audio>
    <input type="file" ref="inputFile" @change="updateFile($event)"/>
    <UButton @click="detectVideo(true),display.video=true" label="Resume"/><UButton label="load sound" @click="loadSound()"/>
    <div style="position: relative;width: 1000px;height: 1000px;">
    
      <canvas style="position: absolute;top:0;right:0px;width:100%" ref="canvas"></canvas>
      
      <video v-show="display.video" ref="video" playsinline="" autoplay></video>
      <img v-for="item in arr" :src="item" />
    </div>


  </div>

</template>

<script setup>
import sound from "@/assets/sound.mp3";
var audio=null
const corns=ref([])
const audioE=ref(null)
const inputFile=ref(null)
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
  const rs=detector.value.detect(source)
    const rs1=rs.then(symbols => {
      
      if (symbols.length > 0) {
        audio=new Audio(sound)
        arr.value=[]
        corns.value=[]
        let temp=0
        canvas.value.width = source.naturalWidth || source.videoWidth || source.width
        canvas.value.height = source.naturalHeight || source.videoHeight || source.height
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
        const pro=new Promise((resolve,reject)=>{
          symbols.forEach((symbol,i) => {
            if(symbol.cornerPoints[1].x-symbol.cornerPoints[0].x>5){
              temp+=1
            }
            corns.value.push(symbol.cornerPoints)
            const lastCornerPoint = symbol.cornerPoints[symbol.cornerPoints.length - 1]
            ctx.value.moveTo(lastCornerPoint.x, lastCornerPoint.y)
            const promise1=new Promise((resolve1,reject1)=>{
              symbol.cornerPoints.forEach((point,i1) => {
              ctx.value.lineTo(point.x, point.y)
              if(i1==symbol.cornerPoints.length-1){
                ctx.value.lineWidth = 3
                ctx.value.strokeStyle = '#00e000ff'
                ctx.value.stroke()
                resolve1()
                
              }
            })
            })
            promise1.then(rs=>{
              canvas.value.style.position = 'absolute'
              canvas.value.style.top = '0'
              if(i==symbols.length-1){
                resolve()
              }
            })
          })
        })
        const st=pro.then(res=>{
          const promise=new Promise((resolve,reject)=>{
            if(temp>1){
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
          const r=promise.then(rs=>{
            symbols.forEach(symbol => {
              delete symbol.boundingBox
              delete symbol.cornerPoints
            })
            result.value = JSON.stringify(symbols)
            audio.play();
           return 'Done'
          }).catch(err=>{console.log(err)})
          return r
        })
        return st
      }
      else {
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      }
      
    }).catch(err=>{
      result.value=err
    })
    const st=rs1.then(rs=>{
      return rs
    })
    return st
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
      .then(() => {
        requestId.value = requestAnimationFrame(() => detectVideo(true))
      }).catch(err=>result.value=err)

  } else {
    cancelAnimationFrame(requestId)
    requestId.value = null
  }
}
function loadSound(){
  audio = new Audio(sound);

  audio.play();
  audio.pause();
  audio.currentTime = 0;

    document.body.removeEventListener('click', loadSound)
    document.body.removeEventListener('touchstart', loadSound)
}
onMounted(async () => {
  try {
    window['BarcodeDetector'].getSupportedFormats()
  } catch {
    window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill
  }
  ctx.value = canvas.value.getContext('2d')
  await createDetector()
  
  navigator.mediaDevices.getUserMedia(constrains).then(stream => {
    video.value.srcObject = stream
    detectVideo()
  })
    
})
async function updateFile(e){
  //detect(e.target.files[0])
  const supportedFormats = await BarcodeDetector.getSupportedFormats()
  const t=new BarcodeDetector({ formats: supportedFormats, zbar: { encoding: 'utf-8' } })
  detect(e.target.files[0]).then(rs=>{
    console.log(rs)
  })
  console.log(e.target.files)
}
</script>