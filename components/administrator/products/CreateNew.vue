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
            create new product {{ sizeScreen.w }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="emits('confirmWindow', true, 'hel woo')" />
        </div>
      </template>
      <UForm :schema="schema" :state="product" class="space-y-4" @submit="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-4">
          <UFormGroup label="Tên sản phẩm" name="name">
            <UInput v-model="product.name" />
          </UFormGroup>
          <UFormGroup label="Barcode" name="barcode">
            <UButtonGroup class="w-full">
              <UInput v-model="product.barcode" class="w-full" />
              <UButton icon="i-material-symbols-light-barcode-scanner-rounded" />
            </UButtonGroup>
          </UFormGroup>
        </div>
        <UFormGroup label="Categories" name="categories">
          {{selected.length>0?selectedCal:''}}
          {{categories?categories.$refs.trigger.el.clientWidth:''}}
            <USelectMenu multiple v-model="categoriesSelected" :options="product.categories.data" optionAttribute="title" optionValue="_id" :creatable="!status.loading" searchable :loading="status.loading"  ref="categories">
            <template #label>
              <div v-for="item,key in product.categories.value"  ref="selected">
                <UBadge v-if="categories && selected.filter((item,i)=>i<=key).reduce((v1,val2)=>v1+val2.clientWidth,0)+500<categories.$refs.trigger.$el.clientWidth">{{ item.title }}</UBadge>
                
              </div>
              <span>{{ product.categories.value.length }}</span>
              
            </template>
            <template #option-create="{ option }">
                <span class="flex-shrink-0">New label:</span>
      <span
        class="flex-shrink-0 w-2 h-2 mt-px rounded-full -mx-1"
      />
      <span class="block truncate">{{ option.title }}</span>
      
    </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup label="Photos" name="images">
          <div :class="'min-h-32 w-full border border-dotted border-2 rounded-md '+(product.previewImages.length<1?' cursor-pointer':'')">
            <div v-if="product.previewImages.length==0" @click="fileSelected.click()" class="w-full min-h-32 justify-center items-center flex">
              <UIcon  name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400"/>
            </div>
            
            <div v-else class="grid grid-cols-1">
              
              <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
                <div v-for="src,index in product.previewImages" class="relative">
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
        <UFormGroup label="Description" name="description">
          <UTextarea v-model="product.description" rows="6"/>
        </UFormGroup>
        <UFormGroup label="Note" name="note">
          <UTextarea v-model="product.note" rows="6"/>
        </UFormGroup>
        <UFormGroup label="Tags" name="tags">
          <UTextarea v-model="product.tags" rows="6" disabled/>
        </UFormGroup>
        <div class="flex justify-end gap-1">
          <UButton type="submit">Create</UButton>
          <UButton color="red" variant="ghost">Cancel</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { compile } from 'vue';
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
onBeforeMount(async ()=>{
  await $fetch('/api/categories/list').then(res=>{
    product.value.categories.data=res
  })
})
onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})
const product = ref({
  name: null,
  barcode: null,
  description: null,
  images: [],
  categories: {
    data:[],
    value:[]
  },
  note: null,
  previewImages:[],
  tags:null
})
const categories=ref(null)
const selected=ref([])
const selectedCal=computed({
  get:()=>selected.value.reduce((val1,val2)=>val1+val2.clientWidth,0)+500
})
const status=ref({
  loading:false
})
const categoriesSelected=computed({
  get:()=>product.value.categories.value,
  set:async (val)=>{
    const arr=val.map(async (item)=>{
      if(item._id){
        return item
      }
      status.value.loading=true
      return await $fetch('/api/categories/create',{
        method:"POST",
        body:JSON.stringify({
          title:item.title
        })
      }).then(res=>{
        if(res.length>0){
          product.value.categories.data.push(res[0])
          status.value.loading=false
          return res[0]
        }
      })
    })
    product.value.categories.value=await Promise.all(arr)
  }
})

const fileSelected=ref()
function previewSelected(e){
  const file=e.target.files[0]
  product.value.previewImages.push(URL.createObjectURL(file))
  console.log(file)
  product.value.images.push(file)
}
function removeImage(val){
  product.value.previewImages.forEach((item,index)=>{
    if(val==item){
      product.value.previewImages.splice(index,1)
      product.value.images.splice(index,1)
    }
  })
}
const schema = z.object({
  name: z.string().min(2)
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>

<style></style>