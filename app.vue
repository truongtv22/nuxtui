<template>
  <div>
    <NuxtLayout :title="title">
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
<script setup>
const route=useRoute()
const pages=ref([
  {
    label:'administrator',
    to:'/administrator'
  }
])
const title=ref()
onBeforeMount(()=>{
  pages.value.forEach(item=>{
    if(item.to==route.fullPath){
      title.value=item.label
      useSeoMeta({
        title:item.label.charAt(0).toUpperCase() + item.label.slice(1)+' - PDM Phuong Do Mega'
      })
    }
  })
})

</script>