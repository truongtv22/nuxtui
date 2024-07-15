<template>
  <h1>hello world</h1>
  <h2>this is my video</h2>
  <video ref="vid" id="myVid"></video>
</template>
<script setup>
const vid=ref(null)
onMounted(async ()=>{
  const constraints = {
  audio: true,
  video: { width: 1280, height: 720 },
};

const stream=await navigator.mediaDevices.getUserMedia(constraints)
const video = document.getElementById("myVid");
window.stream = stream;
  video.srcObject = stream;
})
</script>