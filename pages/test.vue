<template>
  <h1>hello world</h1>
</template>
<script setup>
onMounted(async ()=>{
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
  } catch (err) {
    /* handle the error */
  }
})
</script>