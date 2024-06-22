<template>
  <div class="flex justify-content-center">
    <UContainer class="flex flex-row" :ui="ui">
        <NavigationTree  class="w-80 min-w-12 max-w-80"/>
      <UDivider orientation="vertical" />
      <div class="w-full">
        <ClientOnly>
          <h1 class="capitalize py-5 px-3 font-bold">{{props.title}}</h1>
        </ClientOnly>
        <UDivider orientation="horizontal" />
        <slot class="w-full"/>
      </div>
        
      
      
    </UContainer>
    
  </div>
</template>

<script lang="ts" setup>
import NavigationTree from '~/components/navigation/NavigationTree.vue';
const props=defineProps(['title'])
const ui=ref({
  constrained:'max-w-full w-full',
  padding:'px-0 lg:px-0',
  base:'text-xl'
})
function test1(){
  console.log(123)
}

</script>

<style>

</style>