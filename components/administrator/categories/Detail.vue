<template>
  <AdministratorCategoriesCreateNew :data="props.data" @updateData="emits('updateData',$event)" @doing="emits('doing',$event)" @modal="modal.display=$event.display,modal.data=$event.data"/>
  <UModal v-model="modal.display" fullscreen>
    <UCard :ui="{
      base: 'h-fit flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'grow'
      },
      header: {
        base: 'bg-blue-500'
      }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="capitalize text-base font-semibold leading-6 text-white dark:text-white">
            Detail photo {{ myTitle }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modal.display = false" />
        </div>
      </template>
      <img :src="modal.data" class="w-full" />
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const route=useRoute()
const props = defineProps(['data'])
const emits = defineEmits([ 'confirmWindow', 'updateData','doing'])
const modal=ref({
  display:false,
  data:null
})
</script>

<style></style>