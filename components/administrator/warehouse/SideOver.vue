<template>
  <USlideover v-if="productList.display" v-model="productList.display" side="bottom" @close="emits('isOpen',true)"
      :ui="{ wrapper: 'w-full lg:w-1/2 left-25 lg:inset-x-1/4 sm:-top-2 h-full sm:h-full', height: 'max-h-screen h-full sm:h-4/5 overflow' }">
      <div class="p-4 flex-col flex h-full">
        <div class="flex flex-row justify-between mb-4">
          <slot name="header">
            <h1 class="font-bold">Product list1</h1>
          </slot>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1 block md:hidden" @click="productList.display = false;emits('isOpen',true)"/>
        </div>
        

        <slot name="body"/>
      </div>
    </USlideover>
</template>

<script lang="ts" setup>
const props=defineProps(['productList'])
const emits=defineEmits(['isOpen'])
const isOpen=ref(false)

</script>

<style>

</style>