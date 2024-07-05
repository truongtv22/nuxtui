<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ props.title }}
      </template>
      <div v-if="props.description">
        {{ props.description }}
      </div>
      <template #footer>
        <div class="flex justify-center gap-1">
          <UButton color="green" @click="isConfirmed(true)">Yes</UButton>
          <UButton color="red" @click="isConfirmed(false)">No</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const props=defineProps(['display','title','description'])
const emits=defineEmits(['update:display','isConfirmed'])
const isOpen=computed({
  get(){
    return props.display
  },
  set(val){
    emits('update:display',val)
  }
})
const isConfirmed=(val:Boolean)=>{
isOpen.value=false
emits('isConfirmed',val)
}
</script>

<style>

</style>