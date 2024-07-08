<template>
  <UModal :ui="{ width: `sm:max-w-6xl`, overlay: { background: 'backdrop-blur-md' } }" v-model="isOpen"
    :fullscreen="sizeScreen.w < 800 ? true : false" prevent-close>
    <UCard :ui="{
      base: 'h-fit flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'grow'
      },
      header: {
        base: 'bg-green-500'
      }
    }">
    {{category.images.files}}
      <template #header>
        <div class="flex items-center justify-between">
          <UBadge color="green" class="absolute -top-4 left-0 hidden xl:block">Create new</UBadge>
          <h3 class="capitalize text-base font-semibold leading-6 text-white dark:text-white">
            tạo mới thể loại {{ myTitle }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="emits('confirmWindow', true, 'Bạn có chắc muốn đóng cửa sổ này?')" />
        </div>
      </template>
      <UForm ref="form" :schema="schema" :state="category" class="space-y-4" @submit="onSubmit" @error="onError">

        <UFormGroup label="Tên thể loại" name="title">
          <template #hint>
            <span class="text-gray-400 dark:text-gray-500">Required</span>
          </template>
          <UInput ref="inputField" v-model="category.title" @keyup.enter="form.submit()" :disabled="disabled.submit" />
        </UFormGroup>
        <UFormGroup label="Hình ảnh" name="images">
          <div
            :class="'min-h-32 w-full border border-dotted border-2 rounded-md ' + (category.previewImages.length < 1 ? ' cursor-pointer' : '')">
            <div v-if="category.previewImages.length == 0" @click="fileSelected.click()"
              class="w-full min-h-32 justify-center items-center flex">
              <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                class="text-7xl text-gray-400" />
            </div>

            <div v-else class="grid grid-cols-1">

              <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
                <div v-for="src, index in category.previewImages" class="relative">
                  <img :src class="rounded-md w-full min-h-52 max-h-52 object-cover" :key="index"
                    @mouseover="showElement = index" />
                  <div
                    class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md"
                    v-show="showElement == index" @mouseout="showElement = null">
                    <UButton variant="soft" :ui="{ rounded: 'rounded-full' }"
                      icon="i-material-symbols-light-visibility-outline-rounded" color="blue" />

                  </div>
                  <div
                    class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer"
                    @click="removeImage(index)">
                    <UIcon name="i-material-symbols-light-close-small-outline-rounded" />
                  </div>

                </div>
              </div>
              <UDivider />
              <div class="flex justify-center cursor-pointer" @click="fileSelected.click()">
                <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                  class="text-7xl text-gray-400" />
              </div>
            </div>

            <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected" @change="previewSelected"
              multiple />
          </div>
          <UButton @click="uploadFile(category.images[0])">Upload</UButton>
        </UFormGroup>
        <UFormGroup label="Mô tả" name="description">
          <UTextarea v-model="category.description" rows="6" />
        </UFormGroup>
        <UFormGroup label="Ghi chú" name="note">
          <UTextarea v-model="category.note" rows="6" />
        </UFormGroup>
        <UFormGroup label="Tags" name="tags">
          <UTextarea v-model="category.tags" rows="6" disabled />
        </UFormGroup>
        <div class="flex justify-end gap-1">
          <UButton ref="myBtn" type="submit" :disabled="disabled.submit" :loading="disabled.submit">Tạo mới</UButton>
          <UButton color="red" variant="ghost" @click="form.clear(), resetData()">Huỷ bỏ</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { _0 } from '#tailwind-config/theme/backdropBlur';
import { readUsedSize } from 'chart.js/helpers';
import { z } from 'zod'
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue', 'confirmWindow', 'newData'])
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

onMounted(async () => {
  onResize()
  window.addEventListener('resize', onResize)
})
const form = ref()
const inputField = ref()
const myBtn = ref()
const category = ref({
  title: null,
  description: null,
  images: {
    original: [],
    medium: [],
    small: [],
    files: []
  },
  categories: [],
  note: null,
  previewImages: [],
  tags: null
})
const fileSelected = ref()
function previewSelected(e) {
  for (let i = 0; i < e.srcElement.files.length; i++) {
    const file = e.srcElement.files[i]
    let iss = false
    category.value.images.files.forEach(item => {
      if (item.name == file.name) {
        iss = true
      }
    })
    if (!iss) {
      category.value.previewImages.push(URL.createObjectURL(file))
      category.value.images.files.push(file)
    }
  }
}
function removeImage(index) {
      category.value.previewImages.splice(index, 1)
      category.value.images.files.splice(index, 1)
}
const schema = z.object({
  title: z.string({
    required_error: "Tên thể loại không để trống",
    invalid_type_error: "Tên thể loại phải là ký tự",
  }).min(6, { message: 'Tên thể loại có độ dài ít nhất 6 ký tự' })
})

type Schema = z.output<typeof schema>
function resetData() {
  category.value = {
    title: null,
    description: null,
    images: {
      original: [],
      medium: [],
      small: [],
      files: []
    },
    categories: [],
    note: null,
    previewImages: [],
    tags: null
  }
  const element = form.value
  element.$el.scrollIntoView({ behavior: 'smooth' })
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  disabled.value.submit = true
  const temp = {
    original: [],
    medium: [],
    small: []
  }
  const promises=[]
  const promise = new Promise(async (resolve, reject) => {
      category.value.images.files.forEach(async (item, index) => {
        promises.push(new Promise(async (resolve1,reject1)=>{
          const res = await uploadFile(item, 100)
          if(res.status=='success'){
            temp.original.push(res['data']['original'])
            temp.small.push(res['data']['small'])
            temp.medium.push(res['data']['medium'])
            resolve1()
          }
        }))
    })
    Promise.all(promises).then(res=>{
      resolve()
    })
  })
  promise.then(async res => {
    category.value.images.original = temp.original
    category.value.images.small = temp.small
    category.value.images.medium = temp.medium
    await $fetch('/api/categories/create', {
      body: JSON.stringify(category.value),
      method: 'POST'
    }).then(res => {
      disabled.value.submit = false
      if (Object.hasOwn(res[0], '_id')) {
        setTimeout(() => {
          inputField.value.$refs.input.focus()
        }, 1)
        emits('newData', res[0])
        resetData()
      }
    })
  })



}
const showElement = ref(null)
const disabled = ref({
  submit: false
})
async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
async function resizeImage(file, size) {
  size ??= 100

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  const ratio = Math.max(size / width, size / height)

  const x = (size - (width * ratio)) / 2
  const y = (size - (height * ratio)) / 2

  ctx.drawImage(bitmap, 0, 0, width, height, x, y, width * ratio, height * ratio)
  const res = new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob)
    }, 'image/jpeg', 1)
  })
  return res
}
async function uploadFile(file, size) {
  let blob = await resizeImage(file, size)
  let resizedFile = new File([blob], file.name, file)
  let data = new FormData()
  data.append('file', file)
  const promise = new Promise(async (resolve, reject) => {
    await $fetch('/api/uploads/image', {
      method: "POST",
      body: data
    }).then(async res => {
      data = new FormData()
      data.append('file', resizedFile)
      await $fetch('/api/uploads/image', {
        method: "POST",
        body: data
      }).then(async res1 => {
        blob = await resizeImage(file, 200)
        resizedFile = new File([blob], file.name, file)
        data = new FormData()
        data.append('file', resizedFile)
        await $fetch('/api/uploads/image', {
          method: "POST",
          body: data
        }).then(res2 => {
          resolve({
            status:'success',
            data:{
              original:res['data']['original'],
            medium:res1['data'].original,
            small:res2.data.original
            }
            
          })
        })
      })
    })
  })
  return promise
}
</script>

<style></style>