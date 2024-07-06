<template>
  <div>
    <NuxtLayout :title="title">
      <NuxtLoadingIndicator />
      <NuxtPage/>
    </NuxtLayout>
    <UNotifications :icon="store.icon" :ui="{position:'top-0',wrapper:'justify-start h-fit'}">
      <template #title="{ title }">
      <span v-html="title" />
    </template>

    <template #description="{ description }">
      <span v-html="description" />
    </template>
    </UNotifications>
  </div>
</template>
<script setup>
const store=useMyNotificationsStore()
const basicStore=useMyBasicStore()
const route=useRoute()
const pages=useMyMenuItemsStore()
onMounted(()=>{
  basicStore.updateSizeScreen({w:window.innerWidth,h:window.innerHeight})
  window.addEventListener('resize',()=>{
    basicStore.updateSizeScreen({w:window.innerWidth,h:window.innerHeight})
  })
})
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