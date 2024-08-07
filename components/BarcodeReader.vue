<template>
  <div class="flex justify-center w-full h-full relative">
    <div :style="(display.video ? `height: ${constrains.video.height}px;` : '')" ref="container"
      class="flex justify-center relative w-full">
      <div :class="`w-${display.video ? 'full' : '3/4'} relative h-full`">
        <canvas style="position: absolute;top:0;left:0px;" ref="canvas"></canvas>
        <div v-if="display.video" style="" class="absolute w-full h-full flex items-center justify-center">
          <div class="relative flex items-center justify-center w-3/4 h-3/4 border-2 rounded-md" ref="el1">
            <div class="w-full h-8 bg-white top-0 absolute backdrop-blur-3xl opacity-50" ref="el2"
              style="transition: all ease-in-out 1s;"></div>
          </div>

        </div>
        <video v-if="display.video" ref="video" playsinline="" autoplay
          style="width:100%;height:100%;object-fit: cover;"></video>
        <img v-else :src="previewImage" class=" object-cover w-full h-full" ref="imgEl" />
        <UButton v-if="!display.video" size="xl" class="absolute top-0 right-0" variant="soft" @click="activeCam">
          <UIcon name="i-material-symbols-light-close-rounded"></UIcon>
        </UButton>
      </div>

      <div class="w-full absolute bottom-0 p-4">
        <UInput disabled class="w-full" size="xl" v-model="result" :ui="{ icon: { trailing: { pointer: '' } } }">
          <template #leading>
            <UIcon name="i-material-symbols-light-bookmark-check-rounded"></UIcon>
          </template>
          <template #trailing>
            <UIcon name="i-material-symbols-light-photo-camera-rounded" @click="fileSelect.click()"
              class="cursor-pointer"></UIcon>
            <input type="file" class="hidden" ref="fileSelect" @change="previewSelected($event)" />
          </template>
        </UInput>
      </div>
      <img v-for="item in arr" :src="item" />
    </div>
  </div>




</template>

<script setup>
import sound from "@/assets/sound5.mp3";

const emits = defineEmits(['result'])
const notiStore = useMyNotificationsStore()
const fileSelect = ref(null),
  myLoop = ref(null),
  imgEl = ref(null),
  shapes = ref([])
const previewImage = ref(null)
const el1 = ref(null)
const el2 = ref(null)
const container = ref(null)
var audio = null
const corns = ref([])
const audioE = ref(null)
const inputFile = ref(null)
const arr = ref([])
const display = ref({
  video: true,
  image: false
})
const video = ref(null)
const image = ref(null)
const canvas = ref(null),
  detector = ref(null),
  result = ref(null),
  requestId = ref(null),
  ctx = ref(null)
const constrains = ref({
  audio: false,
  video: {
    width: 1000,
    height: 1000,
    facingMode: 'environment'
  }
})
async function createDetector() {
  const supportedFormats = await BarcodeDetector.getSupportedFormats()
  detector.value = new BarcodeDetector({ formats: supportedFormats, zbar: { encoding: 'utf-8' } })
}
function detect(source) {
  const rs = detector.value.detect(source)
  const rs1 = rs.then(symbols => {
    if (symbols.length > 0) {
      let temp = 0
      canvas.value.width = display.value.video ? video.value.clientWidth : imgEl.value.clientWidth
      canvas.value.height = display.value.video ? video.value.clientHeight : imgEl.value.clientHeight
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      const pro = new Promise((resolve, reject) => {
        symbols.forEach((symbol, i) => {
          if (display.value.video) {
            emits('result', symbol.rawValue)
          }

          result.value = symbol.rawValue
          notiStore.showNotification({ type: 'success', title: symbol.format, description: symbol.rawValue })
          if (symbol.cornerPoints[1].x - symbol.cornerPoints[0].x > 5) {
            temp += 1
          }
          const lastCornerPoint = symbol.cornerPoints[symbol.cornerPoints.length - 1]
          let xRate = null, yRate = null
          xRate = symbol.boundingBox.x / (source.naturalWidth || source.videoWidth || source.width)
          yRate = symbol.boundingBox.y / (source.naturalHeight || source.videoHeight || source.height)
          const rect = new Path2D()
          const rateW = canvas.value.width / (source.naturalWidth || source.videoWidth || source.width)
          const rateH = canvas.value.height / (source.naturalHeight || source.videoHeight || source.height)
          rect.rect(canvas.value.width * xRate, canvas.value.height * yRate, symbol.boundingBox.width * (display.value.video ? 1 : rateW), symbol.boundingBox.height * (display.value.video ? 1 : rateH))
          ctx.value.strokeStyle = 'red'
          ctx.value.lineWidth = 6
          ctx.value.stroke(rect)
          if (!display.value.video) {
            canvas.value.addEventListener('click', (e) => {
              if (ctx.value.isPointInPath(rect, e.offsetX, e.offsetY)) {
                notiStore.showNotification({ type: 'success', title: symbol.format, description: symbol.rawValue })
                emits('result',symbol.rawValue)
              }
            })
          }


          if (i == symbols.length - 1) {
            playSound(true)
            resolve()
          }
        })
      })
      const st = pro.then(res => {
        const promise = new Promise((resolve, reject) => {
          if (temp > 1 && display.value.video) {
            var w = video.value.videoWidth || source.naturalWidth || source.videoWidth || source.width;
            var h = video.value.videoHeight || source.naturalWidth || source.videoWidth || source.width;
            var canvas1 = document.createElement('canvas');
            canvas1.width = w;
            canvas1.height = h;
            var ctx1 = canvas1.getContext('2d');
            ctx1.drawImage(video.value, 0, 0, w, h);
            previewImage.value = canvas1.toDataURL("image/jpg");
            detectVideo(false)
            display.value.video = false
            requestId.value = null
            resolve()
          }
          else {
            resolve()
          }
        }).catch(err => console.log(err))
        const r = promise.then(rs => {
          symbols.forEach(symbol => {
            delete symbol.boundingBox
            delete symbol.cornerPoints
          })
          return 'Done'
        }).catch(err => { console.log(err) })
        return r
      })
      return st
    }
    else {
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    }

  }).catch(err => {
    console.log(err)
  })
  const st = rs1.then(rs => {
    const rss = new Promise((res, rej) => {
      setTimeout(() => {

        res(rs)
      }, 100)
    })
    return rss
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
      }).catch(err => result.value = err)

  } else {
    cancelAnimationFrame(requestId)
    requestId.value = null
  }
}
var context
function playSound(status) {
  context = window.audioContext;
  console.log(context)
  var request = new XMLHttpRequest();
  request.open('GET', sound, true);
  request.responseType = 'arraybuffer';
  request.addEventListener('load', function (e) {
    context.decodeAudioData(this.response, function (buffer) {
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    });
  }, false);
  request.send();
}
function loadSound() {
  if (window.audioContext) {
    // Create empty buffer
    var buffer = window.audioContext.createBuffer(1, 1, 22050);
    var source = window.audioContext.createBufferSource(sound);
    source.buffer = buffer;
    // Connect to output (speakers)
    source.connect(window.audioContext.destination);
    // Play sound
    if (source.start) {
      source.start(0);
    } else if (source.play) {
      source.play(0);
    } else if (source.noteOn) {
      source.noteOn(0);
    }
  }
  // Remove events
  document.removeEventListener('touchstart', loadSound);
  document.removeEventListener('touchend', loadSound);
}

onMounted(async () => {
  setTimeout(() => {
    const rect = container.value.getBoundingClientRect()
    constrains.value.video.width = container.value.innerWidth
    constrains.value.video.height = window.innerHeight - rect.top
    setTimeout(() => {
      const space = Math.floor(el1.value.offsetHeight) - Math.floor(el2.value.offsetHeight) - 2
      let x = 0
      let turn = false
      myLoop.value = setInterval(() => {
        el2.value.style.transform = `translateY(${x}px)`
        if (turn == false) {
          x = space
          if (x == space) {
            turn = true
          }
        }
        else {
          x = 0
          if (x == 0) {
            turn = false
          }
        }
      }, 1000)
    }, 1)

  }, 1)


  setTimeout(() => {
    video.value.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });
  }, 1)

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (window.AudioContext) {
    window.audioContext = new window.AudioContext();
  }
  document.addEventListener('touchstart', loadSound);
  // iOS 9
  document.addEventListener('touchend', loadSound);
  try {
    window['BarcodeDetector'].getSupportedFormats()
  } catch {
    window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill
  }
  ctx.value = canvas.value.getContext('2d')
  await createDetector()

  navigator.mediaDevices.getUserMedia(constrains.value).then(stream => {
    video.value.srcObject = stream
    detectVideo()
  })

})
function activeCam() {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  result.value = null
  createDetector()
  setTimeout(() => {
    const space = Math.floor(el1.value.offsetHeight) - Math.floor(el2.value.offsetHeight) - 2
    let x = 0
    let turn = false
    myLoop.value = setInterval(() => {
      el2.value.style.transform = `translateY(${x}px)`
      if (turn == false) {
        x = space
        if (x == space) {
          turn = true
        }
      }
      else {
        x = 0
        if (x == 0) {
          turn = false
        }
      }
    }, 1000)
  }, 1)
  display.value.video = true
  container.value.style.height = constrains.value.video.height + 'px'
  canvas.value.width = 0
  canvas.value.height = 0
  navigator.mediaDevices.getUserMedia(constrains.value).then(stream => {
    video.value.srcObject = stream
    detectVideo()
  })
}

function previewSelected(e) {
  clearInterval(myLoop.value)
  display.value.video = false
  for (let i = 0; i < e.srcElement.files.length; i++) {
    const file = e.srcElement.files[i]
    previewImage.value = URL.createObjectURL(file)
    setTimeout(() => {
      imgEl.value.decode().then(() => {
        detect(imgEl.value)
      })
    }, 100)
  }
}
function collides(rects, x, y) {
  var isCollision = false;
  for (var i = 0, len = rects.length; i < len; i++) {
    var left = rects[i].x, right = rects[i].x + rects[i].width;
    var top = rects[i].y, bottom = rects[i].y + rects[i].height;
    if (right >= x
      && left <= x
      && bottom >= y
      && top <= y) {
      isCollision = rects[i];
    }
  }
  return isCollision;
}
</script>