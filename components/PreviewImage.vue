<template>
  <div class="relative w-full" @mouseover="showEyeBtn=true" @mouseout="showEyeBtn=false">
    <NuxtImg :class="`rounded-md w-full ${(!width && !height)?'min-h-52 max-h-52':`h-${height} w-${width}`} object-cover`" :src="data.small" loading="lazy"/>
    <div
      :class="`w-full ${!width&&!height?'min-h-52 max-h-52':`h-${height} w-${width}`} absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md cursor-pointer`"
      v-show="showEyeBtn">
      <UButton @click="showModal=true" variant="soft" :ui="{ rounded: 'rounded-full' }"
        icon="i-material-symbols-light-visibility-outline-rounded" color="blue"
        />
    </div>
    <UButton @click="emits('remove')" icon="i-material-symbols-light-close-small-outline-rounded" :ui="{rounded:'rounded-full'}" size="2xs" color="red" class="absolute -top-2 -right-2 z-10"/>
    <div :class="`transition-all duration-1000 flex absolute top-0 left-0 w-full backdrop-blur-${loading<30?'xl':(loading<60?'md':'xs')} h-full items-center px-2`" v-if="status">
      <UProgress :value="props.loading" animation="carousel" />
    </div>
  </div>
  <UModal v-model="showModal" :ui="{container:'backdrop-blur-md'}">
      <div class="p-2 flex justify-center items-center">
        <NuxtImg :src="data.original"/>
      </div>
      <UButton @click="showModal=false" icon="i-material-symbols-light-close-small-outline-rounded" class="absolute -top-2 -right-2"  :ui="{rounded:'rounded-full'}" size="2xs" color="red"/>
    </UModal>
</template>

<script lang="ts" setup>
const props=defineProps(['data','loading','status','width','height'])
const emits=defineEmits(['remove'])
const showEyeBtn=ref(false),
showModal=ref(false)
</script>

<style>

</style>