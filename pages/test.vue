<template>
  <h1>hello world</h1>
  <video ref="vid"/>
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
    video.value.srcObject = mediaStream;
    video.value.onloadedmetadata = () => {
      video.value.play();
    };
  })
  .catch((err) => {
    // always check for errors at the end.
    console.error(`${err.name}: ${err.message}`);
  });
})
</script>