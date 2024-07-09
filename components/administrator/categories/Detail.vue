<template>
  <UForm ref="form" :schema="schema" :state="category" class="space-y-4" @submit="onSubmit" @error="onError">
    <UFormGroup label="Tên thể loại" name="title">
      <template #hint>
        <span class="text-gray-400 dark:text-gray-500">Required</span>
      </template>
      <UInput v-model="category.title" />
    </UFormGroup>
    <UFormGroup label="Hình ảnh" name="images">
      <div
        :class="'min-h-32 w-full border border-dotted border-2 rounded-md ' + (category.images.length < 1 ? ' cursor-pointer' : '')">
        <div v-if="category.imagesOld.medium.length == 0 && category.previewImages.length == 0"
          @click="fileSelected.click()" class="w-full min-h-32 justify-center items-center flex">
          <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400" />
        </div>

        <div v-else class="grid grid-cols-1">

          <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
            <div v-for="src, index in category.previewImages" class="relative">
              <img :src class="rounded-md w-full min-h-52 max-h-52 object-cover" :key="index"
                @mouseover="showElement = src" />
              <div class="absolute top-1/2 p-2 w-full">
                <UMeter :value="meter.data" v-if="meter.display == index"></UMeter>
              </div>
              <div
                class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md"
                v-show="showElement == src" @mouseout="showElement = null">
                <UButton variant="soft" :ui="{ rounded: 'rounded-full' }"
                  icon="i-material-symbols-light-visibility-outline-rounded" color="blue"
                  @click="modal.data = src, modal.display = true" />

              </div>
              <div
                class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer"
                @click="removeImage(index, 'temp')">
                <UIcon name="i-material-symbols-light-close-small-outline-rounded" />
              </div>
            </div>
            <div v-for="src, index in category.imagesOld.medium" class="relative">
              <img :src class="rounded-md w-full min-h-52 max-h-52 object-cover" :key="index"
                @mouseover="showElement = src" />
              <div
                class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md"
                v-show="showElement == src" @mouseout="showElement = null">
                <UButton variant="soft" :ui="{ rounded: 'rounded-full' }"
                  icon="i-material-symbols-light-visibility-outline-rounded" color="blue"
                  @click="modal.data = category.imagesOld.original[index], modal.display = true" />

              </div>
              <div
                class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer"
                @click="removeImage(index, 'old')">
                <UIcon name="i-material-symbols-light-close-small-outline-rounded" />
              </div>
            </div>
          </div>
          <UDivider />
          <div class="flex justify-center cursor-pointer" @click="fileSelected.click()">
            <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400" />
          </div>
        </div>

        <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected" @change="previewSelected"
          multiple />
      </div>
    </UFormGroup>
    <UFormGroup label="Mô tả" name="description">
      <UTextarea v-model="category.description" :rows="6" />
    </UFormGroup>
    <UFormGroup label="Ghi chú" name="note">
      <UTextarea v-model="category.note" :rows="6" />
    </UFormGroup>
    <UFormGroup label="Tags" name="tags">
      <UTextarea v-model="category.tags" :rows="6" disabled />
    </UFormGroup>
    <div class="flex justify-end gap-1">
      <UButton color="blue" type="submit" :disabled="disabled.submit" :loading="disabled.submit">Cập nhật</UButton>
      <UButton color="red" variant="ghost" @click="form.clear(), resetData(),scrollToForm()">Huỷ bỏ</UButton>
    </div>
  </UForm>
  <UModal v-model="modal.display" fullscreen>
    <UCard :ui="{
      base: 'h-fit flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'grow'
      },
      header: {
        base: 'bg-blue-500'
      }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="capitalize text-base font-semibold leading-6 text-white dark:text-white">
            Detail photo {{ myTitle }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modal.display = false" />
        </div>
      </template>
      <img :src="modal.data" class="w-full" />
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>

import { z } from 'zod'
const props = defineProps(['data'])
const emits = defineEmits([ 'confirmWindow', 'updateData'])
onBeforeMount(() => {
  resetData()
})

const form = ref()
const category = ref({
  title: null,
  description: null,
  images: {
    original: [],
    medium: [],
    small: [],
    files: []
  },
  imagesOld: {
    original:[],
    medium:[],
    small:[]
  },
  categories: [],
  note: null,
  previewImages: [],
  tags: null,
  _id: null,
  created_at: null,
  edited_at: null
})
const meter = ref({
  display: null,
  data: 0
})
const modal = ref({
  display: false,
  data: null
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
function removeImage(index, type) {
  switch (type) {
    case 'temp':
      category.value.previewImages.splice(index, 1)
      category.value.images.splice(index, 1)
      break
    case 'old':
      Object.keys(category.value.imagesOld).forEach(property => {
        category.value.imagesOld[property].splice(index, 1)
      })
      break
  }


}
const schema = z.object({
  title: z.string({
    required_error: "Tên thể loại không để trống",
    invalid_type_error: "Tên thể loại phải là ký tự",
  }).min(6, { message: 'Tên thể loại có độ dài ít nhất 6 ký tự' })
})

type Schema = z.output<typeof schema>
function resetData() {
  Object.keys(category.value).forEach(item => {
    if (item != 'images' && item!='imagesOld') {
      category.value[item] = props.data[item]
    }

  })
  Object.keys(category.value.imagesOld).forEach(item=>{
    category.value.imagesOld[item]=[]
    props.data.images[item].forEach(item1=>{
      category.value.imagesOld[item].push(item1)
    })
  })
  category.value.previewImages = []
  
}
function scrollToForm(){
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
  const promises = []
  const promise = new Promise(async (resolve, reject) => {
    if (category.value.images.files.length > 0) {
      for (const [index, item] of category.value.images.files.entries()) {
        meter.value.display = index
        meter.value.data = 0
        const nums = Array.from(Array(101), (_, x) => x);
        for (const x of nums) {
          setTimeout(() => { meter.value.data = x }, 500)
        }
        const res = await uploadFile(item, 100)
        if (res.status == 'success') {
          temp.original.push(res['data']['original'])
          temp.small.push(res['data']['small'])
          temp.medium.push(res['data']['medium'])
          meter.value.data = 100
          meter.value.display = false
        }
        if (index == category.value.images.files.length - 1) {
          resolve()
        }
      }
    }
    else {
      resolve()
    }
  })
  promise.then(async res => {
    category.value.images.original = temp.original
    category.value.images.small = temp.small
    category.value.images.medium = temp.medium
    Object.keys(category.value.imagesOld).forEach(property => {
      category.value.imagesOld[property].forEach(item => {
        category.value.images[property].push(item)
      })
    })
    await $fetch('/api/categories/update', {
      body: JSON.stringify(category.value),
      method: 'PUT'
    }).then(res => {
      disabled.value.submit = false
      if (Object.hasOwn(res, 'modifiedCount') && res.modifiedCount == 1) {
        emits('updateData', category.value)
      }
    })
  })

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
        blob = await resizeImage(file, 350)
        resizedFile = new File([blob], file.name, file)
        data = new FormData()
        data.append('file', resizedFile)
        await $fetch('/api/uploads/image', {
          method: "POST",
          body: data
        }).then(res2 => {
          resolve({
            status: 'success',
            data: {
              original: res['data']['original'],
              small: res1['data'].original,
              medium: res2.data.original
            }

          })
        })
      })
    })
  })
  return promise
}
const showElement = ref(null)
const disabled = ref({
  submit: false
})
</script>

<style></style>