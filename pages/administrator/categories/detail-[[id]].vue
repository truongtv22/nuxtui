<template>

  <UCard :ui="{
      base: 'h-fit flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'grow'
      },
      header: {
        base: 'bg-blue-500 relative'
      }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="capitalize text-base font-semibold leading-6 text-white dark:text-white">
            {{ category.name }}
          </h3>
        </div>
        <div class="bottom-0 absolute w-full right-0" v-if="loading.doing">
          <UProgress size="xs" color="blue" animation="carousel" :ui="{progress:{rounded:'rounded-none'}}" />
        </div>
      </template>
      <DetailComponent v-if="status.loaded"  :data="category" @doing="loading.doing=$event"/>
      <template v-else>
    <div class="flex flex-col gap-2">
      <USkeleton class="w-full min-h-screen"/>
    </div>
    
   </template>
    </UCard>
   
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
</script>

<style>

</style>