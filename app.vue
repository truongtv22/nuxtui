<template>
  <div>
    
    <NuxtLayout :title="title">
      <NuxtLoadingIndicator />
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
<script setup>
const route=useRoute()
const pages=useMyMenuItemsStore()
const title=computed(()=>{
  let val=null
  pages.admin.forEach(item=>{
    console.log(route.fullPath)
    if(item.to==route.fullPath){
      val=item.label
      useSeoMeta({
        title:item.label.charAt(0).toUpperCase() + item.label.slice(1)+' - PDM Phuong Do Mega'
      })
    }
    else if(item.hasOwnProperty('items')){
      item.items.forEach(itc=>{
        if(itc.to==route.fullPath){
          val=itc.label
          useSeoMeta({
        title:itc.label.charAt(0).toUpperCase() + itc.label.slice(1)+' - PDM Phuong Do Mega'
      })
        }
      })
    }
  })
  return val
})


</script>