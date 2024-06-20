<template>
  <div class="flex justify-content-center">
    <UContainer class="flex flex-row" :ui="ui">
        <NavigationTree  class="w-80 min-w-12 max-w-80"/>
      <UDivider orientation="vertical" />
      <div class="w-full">
        <slot @test="test1" class="w-full"/>
      </div>
        
      
      
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
function test1(){
  console.log(123)
}

</script>

<style>

</style>