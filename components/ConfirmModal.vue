<template>
  <UModal v-model="isOpen" :ui="{overlay:{background:'backdrop-blur-xl'}}" prevent-close>
    <UCard>
      <template #header v-if="props.description">
        {{ props.title }}
      </template>
      <div>
        {{ props.description?props.description:props.title }}
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
const props=defineProps(['modelValue','title','description','input'])
const emits=defineEmits(['update:modelValue','isConfirmed'])
const isOpen=computed({
  get(){
    return props.modelValue
  },
  set(val){
    emits('update:modelValue',val)
  }
})
const isConfirmed=(val:Boolean)=>{
isOpen.value=false
let input=props.input
emits('isConfirmed',props.input)
}
</script>

<style>

</style>