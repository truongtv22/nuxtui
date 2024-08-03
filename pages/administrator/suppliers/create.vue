<template>
  <UCard :ui="{
    base: 'h-fit flex flex-col',
    rounded: '',
    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    body: {
      base: 'grow'
    },
    header: {
      base: `bg-green-500 relative`
    }
  }" class="relative">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="capitalize text-base font-semibold leading-6 text-white dark:text-white">
          tạo mới nha cung cap
        </h3>
      </div>
      <div class="bottom-0 absolute w-full right-0" v-if="loading.create">
        <UProgress size="xs" animation="carousel" :ui="{progress:{rounded:'rounded-none'}}" />
      </div>
    </template>
    <AdministratorSuppliersFormGroup @doing="loading.create=$event" />
</UCard>
</template>

<script lang="ts" setup>
const loading=ref({
  create:false
})
onBeforeMount(()=>{
  useSeoMeta({
    title:'Create new supplier'
  })
})
</script>

<style>

</style>