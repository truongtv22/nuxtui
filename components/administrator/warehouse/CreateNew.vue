<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props=defineProps(['display'])
const emits=defineEmits(['display'])
const isOpen = computed({
  get(){
    return props.display
  },
  set(){
emits('display',false)
  }
})
const sizeScreen=ref({
  w:window.innerWidth,
  h:window.innerHeight
})
function onResize(){
  sizeScreen.value.w=window.innerWidth
  sizeScreen.value.h=window.innerHeight
}
onBeforeMount(()=>{
  window.addEventListener('resize',onResize)
})
onBeforeUnmount(()=>{
  window.removeEventListener('resize',onResize)
})
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>

<template>
  <div>
    <UModal v-model="isOpen" :fullscreen="sizeScreen.w<800?true:false" prevent-close>
      <UCard
        :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: {
            base: 'grow'
          }
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Insert new product to warehouse
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
      </UCard>
    </UModal>
  </div>
</template>

