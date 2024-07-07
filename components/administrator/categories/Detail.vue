<template>
  <UForm ref="form" :schema="schema" :state="category" class="space-y-4" @submit="onSubmit" @error="onError"> 

<UFormGroup label="Tên thể loại" name="title"  >
  <template #hint>
<span class="text-gray-400 dark:text-gray-500">Required</span>
</template>
  <UInput v-model="category.title"/>
</UFormGroup>
<UFormGroup label="Hình ảnh" name="images">
<div :class="'min-h-32 w-full border border-dotted border-2 rounded-md '+(category.images.length<1?' cursor-pointer':'')">
  <div v-if="category.images.length==0" @click="fileSelected.click()" class="w-full min-h-32 justify-center items-center flex">
    <UIcon  name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400"/>
  </div>
  
  <div v-else class="grid grid-cols-1">
    
    <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
      <div v-for="src,index in category.previewImages" class="relative">
        <img :src class="rounded-md w-full min-h-52 max-h-52 object-cover" :key="index" @mouseover="showElement=index"/>
        <div class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md" v-show="showElement==index" @mouseout="showElement=null">
          <UButton variant="soft" :ui="{rounded:'rounded-full'}" icon="i-material-symbols-light-visibility-outline-rounded" color="blue"/>
          
        </div>
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
  
  <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected" @change="previewSelected" multiple/>
</div>
</UFormGroup>
<UFormGroup label="Mô tả" name="description">
<UTextarea v-model="category.description" :rows="6"/>
</UFormGroup>
<UFormGroup label="Ghi chú" name="note">
<UTextarea v-model="category.note" :rows="6"/>
</UFormGroup>
<UFormGroup label="Tags" name="tags">
<UTextarea v-model="category.tags" :rows="6" disabled/>
</UFormGroup>
<div class="flex justify-end gap-1">
<UButton color="blue" type="submit" :disabled="disabled.submit" :loading="disabled.submit">Cập nhật</UButton>
<UButton color="red" variant="ghost" @click="form.clear(),resetData()">Huỷ bỏ</UButton>
</div>
</UForm>
</template>

<script lang="ts" setup>

import {z} from 'zod'
const props = defineProps(['data'])
const emits = defineEmits(['update:modelValue', 'confirmWindow','updateData'])
onMounted(()=>{
  Object.keys(category.value).forEach(item=>{
    category.value[item]=props.data[item]
  })
  category.value.previewImages=props.data.images_small
})
const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

const form=ref()
const category = ref({
  title: null,
  description: null,
  images: [],
  categories: [],
  note: null,
  previewImages:[],
  tags:null,
  _id:null,
  created_at:null,
  edited_at:null
})
const fileSelected=ref()
function previewSelected(e) {
  console.log(category.value)
  for(let i=0;i<e.srcElement.files.length;i++){
    const file=e.srcElement.files[i]
    let iss = false
    category.value.images.forEach(item => {
      if (item.name == file.name) {
        iss = true
      }
    })
    if (!iss) {
      category.value.previewImages.push(URL.createObjectURL(file))
      category.value.images.push(file)
    }
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
  title: z.string({
  required_error: "Tên thể loại không để trống",
  invalid_type_error: "Tên thể loại phải là ký tự",
}).min(6,{message:'Tên thể loại có độ dài ít nhất 6 ký tự'})
})

type Schema = z.output<typeof schema>
  function resetData(){
  Object.keys(category.value).forEach(item=>{
    category.value[item]=props.data[item]
  })
      const element =form.value
      element.$el.scrollIntoView({ behavior: 'smooth'})
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  disabled.value.submit=true
  await $fetch('/api/categories/update',{
    body:JSON.stringify(category.value),
    method:'PUT'
  }).then(res=>{
    disabled.value.submit=false
    if(Object.hasOwn(res,'modifiedCount') && res.modifiedCount==1){
      emits('updateData',category.value)
    }
  })
}
const showElement=ref(null)
const disabled=ref({
  submit:false
})
</script>

<style>

</style>