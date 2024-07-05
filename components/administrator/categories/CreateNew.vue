<template>
  <UModal :ui="{ width: `sm:max-w-6xl`, overlay: { background: 'backdrop-blur-md' } }" v-model="isOpen"
    :fullscreen="sizeScreen.w < 800 ? true : false" prevent-close>
    <UCard :ui="{
      base: 'h-fit flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'grow'
      }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="capitalize text-base font-semibold leading-6 text-gray-900 dark:text-white">
            tạo mới thể loại
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="emits('confirmWindow', true, 'Bạn có chắc muốn đóng cửa sổ này?')" />
        </div>
      </template>
      <UForm :schema="schema" :state="category" class="space-y-4" @submit="onSubmit">

          <UFormGroup label="Tên sản thể loại" name="name">
            <UInput v-model="category.name"  />
          </UFormGroup>
        <UFormGroup label="Hình ảnh" name="images">
          <div :class="'min-h-32 w-full border border-dotted border-2 rounded-md '+(category.previewImages.length<1?' cursor-pointer':'')">
            <div v-if="category.previewImages.length==0" @click="fileSelected.click()" class="w-full min-h-32 justify-center items-center flex">
              <UIcon  name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400"/>
            </div>
            
            <div v-else class="grid grid-cols-1">
              
              <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
                <div v-for="src,index in category.previewImages" class="relative">
                  <img :src class="rounded-md" :key="index"/>
                  <div class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer" @click="removeImage(src)">
                    <UIcon name="i-material-symbols-light-close-small-outline-rounded"/>
                  </div>
                  
                </div>
              </div>
              <UDivider/>
              <div class="flex justify-center cursor-pointer" @click="fileSelected.click()">
                <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400"/>
              </div>
            </div>
            
            <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected" @change="previewSelected"/>
          </div>
        </UFormGroup>
        <UFormGroup label="Mô tả" name="description">
          <UTextarea v-model="category.description" rows="6"/>
        </UFormGroup>
        <UFormGroup label="Ghi chú" name="note">
          <UTextarea v-model="category.note" rows="6"/>
        </UFormGroup>
        <UFormGroup label="Tags" name="tags">
          <UTextarea v-model="category.tags" rows="6" disabled/>
        </UFormGroup>
        <div class="flex justify-end gap-1">
          <UButton type="submit">Tạo mới</UButton>
          <UButton color="red" variant="ghost">Huỷ bỏ</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import {z} from 'zod'
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue', 'confirmWindow'])
const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
const sizeScreen = ref({
  w: null,
  h: null
})
function onResize() {
  sizeScreen.value.w = window.innerWidth
  sizeScreen.value.h = window.innerHeight
}
onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})
const category = ref({
  name: null,
  barcode: null,
  description: null,
  images: [],
  categories: [],
  note: null,
  previewImages:[],
  tags:null
})
const fileSelected=ref()
function previewSelected(e){
  const file=e.target.files[0]
  let iss=false
  category.value.images.forEach(item=>{
    if(item.name==file.name){
      iss=true
    }
  })
  if(!iss){
    category.value.previewImages.push(URL.createObjectURL(file))
  category.value.images.push(file)
  }
  
}
function removeImage(val){
  category.value.previewImages.forEach((item,index)=>{
    if(val==item){
      category.value.previewImages.splice(index,1)
      category.value.images.splice(index,1)
    }
  })
}
const schema = z.object({
  name: z.string({
  required_error: "Tên thể loại không để trống",
  invalid_type_error: "Tên thể loại phải là ký tự",
}).min(2,{message:'Tên thể loại có độ dài ít nhất 6 ký tự'})
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>

<style></style>