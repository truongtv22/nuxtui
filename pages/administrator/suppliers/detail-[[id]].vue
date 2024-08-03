<template>
  <div v-if="!data" class="flex gap-y-2 flex-col h-full">
    <USkeleton class="min-h-20 w-full" />
    <div class="w-full flex-1 flex flex-col gap-y-2 p-4">
      <USkeleton class="w-full min-h-36" />
      <USkeleton class="w-full flex-1" />
    </div>
  </div>
  <UCard v-else :ui="{
    base: 'min-h-full flex flex-col',
    rounded: '',
    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    body: {
      base: 'grow'
    },
    header: {
      base: `bg-blue-500 relative`
    }
  }" class="relative">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="capitalize text-base font-semibold leading-6 text-white dark:text-white">
          {{ data?data.name:'No data' }}
        </h3>
      </div>
      <div class="bottom-0 absolute w-full right-0" v-if="loading.create">
        <UProgress size="xs" animation="carousel" :ui="{progress:{rounded:'rounded-none'}}" />
      </div>
    </template>
    <AdministratorSuppliersFormGroup v-if="data" :data="data" @doing="loading.create=$event"/>
</UCard>
</template>

<script lang="ts" setup>
const route=useRoute()
const data=ref(null),
loading=ref({
  create:false
})
async function getData(id){
  return await $fetch('/api/suppliers/get?'+new URLSearchParams({_id:id})).then(res=>{
    return res[0]
  })
}
onBeforeMount(async()=>{
  await getData(route.params.id).then(res=>{
    data.value= res
    useSeoMeta({
      title:data.value.name+'- Editing supplier'
    })
  })
  
})
</script>

<style>

</style>