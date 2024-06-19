<template>
  <div class="flex justify-content-center">
    <UContainer class="flex flex-row" :ui="ui">
        <NavigationTree  class="w-80 min-w-12 max-w-80"/>
      <UDivider orientation="vertical" />
      <UCard :ui="{background:'bg-transparent',shadow:'shadow-none',ring:'ring-0',rounded:'rounded-none',body:{padding:'sm:px-2.5 sm:py-1.5'}}" class="w-full">
        <slot />
      </UCard>
      
    </UContainer>
    
  </div>
</template>

<script lang="ts" setup>
import NavigationTree from '~/components/navigation/NavigationTree.vue';
const ui=ref({
  constrained:'max-w-full w-full',
  padding:'px-0 lg:px-0',
  base:'text-xl'
})


</script>

<style>

</style>