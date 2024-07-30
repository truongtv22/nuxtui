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
            {{ product.name }}
          </h3>
        </div>
        <div class="bottom-0 absolute w-full right-0" v-if="loading.doing">
          <UProgress size="xs" color="blue" animation="carousel" :ui="{progress:{rounded:'rounded-none'}}" />
        </div>
      </template>
      <AdministratorProductsCreateNew v-if="status.loaded"  :data="product" @doing="loading.doing=$event"/>
      <template v-else>
    <div class="flex flex-col gap-2">
      <USkeleton class="w-full min-h-screen"/>
    </div>
    
   </template>
    </UCard>
   
</template>

<script lang="ts" setup>
const route=useRoute()
const notification=useMyNotificationsStore()
const status=ref({
  loaded:false
})
const loading=ref({
  doing:false
})
const product=ref({})
async function getData(id){
  return await $fetch('/api/products/get?'+new URLSearchParams({_id:id})).then(res=>{
    return res[0]
  })
}
onBeforeMount(async ()=>{
 const res=await getData(route.params.id)
  product.value= res
  status.value.loaded=true
  useSeoMeta({
    title:product.value.name
  })
})
</script>

<style>

</style>