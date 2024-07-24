<template>
  <div class="grow px-4 py-5 sm:p-6 relative">
    <DetailComponent v-if="status.loaded"  :data="category" @updateData="updateData" @doing="loading.doing=$event"/>
   <template v-else>
    <div class="flex flex-col gap-2">
      <USkeleton class="w-full min-h-screen"/>
    </div>
    
   </template>
   <div class="top-0 absolute w-full right-0" v-if="loading.doing">
          <UProgress color="blue" size="xs" animation="carousel" :ui="{progress:{rounded:'rounded-none'}}" />
        </div>
  </div>
   
   
</template>

<script lang="ts" setup>
import DetailComponent from '@@/components/administrator/categories/Detail.vue'
const route=useRoute()
const notification=useMyNotificationsStore()
const status=ref({
  loaded:false
})
const loading=ref({
  doing:false
})
const category=ref({
  title: null,
  description: null,
  images: {
    original: [],
    medium: [],
    small: [],
    files: []
  },
  imagesOld: {
    original: [],
    medium: [],
    small: []
  },
  categories: [],
  note: null,
  previewImages: [],
  tags: null,
  _id: null,
  created_at: null,
  edited_at: null
})
async function getData(id){
  return await $fetch('/api/categories/get?'+new URLSearchParams({_id:id})).then(res=>{
    return res[0]
  })
}
onBeforeMount(async ()=>{
 const res=await getData(route.params.id)
  category.value= res
  status.value.loaded=true
  useSeoMeta({
    title:category.value.title
  })
 //console.log(category.value)
})
function updateData(data){
  
  notification.showNotification({
      title: `${data.title} <span class="text-blue-500">updated</span> success`,
      type: 'success'
    })
}
</script>

<style>

</style>