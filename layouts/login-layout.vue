<template>
  <div class="min-w-screen min-h-screen relative flex justify-center items-center">
    <canvas ref="canvas" class="absolute top-0 right-0 z-10" ></canvas>
    <slot/>
  </div>
</template>

<script lang="ts" setup>
const basicStore=useMyBasicStore()
const canvas=ref(null),
ctx=ref(null),
timePoint=ref(null)

function loop(){
  if(Math.floor((Date.now()-timePoint.value)/1000)==1 || !timePoint.value){
    const w=Math.floor(Math.random() * ((basicStore.screenSize.w+basicStore.screenSize.h)/20 - 10 + 1) + 10),
    h=Math.floor(Math.random() * (basicStore.screenSize.w/2 - 10 + 1) + 10),
    x=Math.floor(Math.random() * (basicStore.screenSize.w-w - 0 + 1) + 0),
    y=Math.floor(Math.random() * (basicStore.screenSize.w-w - 0 + 1) + 0)
    ctx.value.clearRect(0,0,ctx.value.canvas.width,ctx.value.canvas.height)
    ctx.value.beginPath();
    ctx.value.arc(x, y, w ,0, 2 * Math.PI);
    ctx.value.stroke();
    timePoint.value=Date.now()
  }
  requestAnimationFrame(loop);
}
onMounted(()=>{
  
  ctx.value = canvas.value.getContext("2d");
    //ctx.value.lineWidth = 1;
    ctx.value.canvas.width=window.innerWidth;
    ctx.value.canvas.height = window.innerHeight
    ctx.value.strokeStyle = "orange";
    ctx.value.beginPath();
    requestAnimationFrame(loop);
})
</script>

<style>

</style>