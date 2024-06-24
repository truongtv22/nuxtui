<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props=defineProps(['display'])
const emits=defineEmits(['display','showProductList'])
const isOpen = computed({
  get(){
    return props.display
  },
  set(){
emits('display',false)
  }
})
const sizeScreen=ref({
  w:null,
  h:null
})
function onResize(){
  sizeScreen.value.w=window.innerWidth
  sizeScreen.value.h=window.innerHeight
}
onMounted(()=>{
  onResize()
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
const productList=ref({
  display:false
})
</script>

<template>
  <div>
    
    <UModal :ui="{width:`sm:max-w-6xl`}" v-model="isOpen" :fullscreen="sizeScreen.w<800?true:false" >
      
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
              Insert new product to warehouse {{ sizeScreen.w }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Tên sản phẩm" name="name">
              <UButton size="xl" variant="outline" class="w-full justify-center flex" @click="productList.display=true"><UIcon name="i-material-symbols-light-add"/></UButton>

      
    </UFormGroup>
    <UFormGroup label="Barcode" name="barcode">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Giá nhập" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Giá bán" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Số lượng" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Đơn vị" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Nhà cung cấp" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Ngày sản xuất" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Thời hạn sử dụng" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Đơn vị" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Ngày hết hạn" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Lãi suất" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Doanh thu tổng" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Tổng chi" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Lãi thực tổng" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Ghi chú" name="price">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
      </UCard>
    </UModal>
    <USlideover v-model="productList.display" side="bottom" >
      <div class="p-4 flex-1">
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          square
          padded
          
          @click="productList.display = false"
        />
        <Placeholder class="h-full" />
      </div>
    </USlideover>
  </div>
</template>

