<template>
  <h1>hello world</h1>
  <h2>this is my video</h2>
  <video ref="vid"></video>
</template>
<script setup>
const vid=ref(null)
onMounted(async ()=>{
  const constraints = {
  audio: true,
  video: { width: 1280, height: 720 },
};

navigator.mediaDevices
  .getUserMedia(constraints)
  .then((mediaStream) => {
    const video = document.querySelector("video");
    video.srcObject = mediaStream;
    video.onloadedmetadata = () => {
      video.play();
    };
  })
  .catch((err) => {
    // always check for errors at the end.
    console.error(`${err.name}: ${err.message}`);
  });
})
</script>