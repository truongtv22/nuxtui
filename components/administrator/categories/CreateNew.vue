<template>

  <UForm ref="form" :validate="validate"  :schema="schema" :state="category" class="space-y-4 relative" @submit="onSubmit" @error="onError">
    <UFormGroup label="Tên thể loại" name="title">
      <template #hint>
        <span class="text-gray-400 dark:text-gray-500">Required</span>
      </template>
      <UInput ref="inputField" v-model="category.title" @keyup.enter="form.submit()" :disabled="disabled.submit" />
    </UFormGroup>
    <UFormGroup label="Hình ảnh" name="images">
      <div
        :class="'min-h-32 w-full border border-dotted border-2 rounded-md ' + (category.previewImages.length < 1 ? ' cursor-pointer' : '')">
        <div v-if="category.imagesOld.medium.length == 0 && category.previewImages.length == 0"
          @click="disabled.submit ? '' : fileSelected.click()" class="w-full min-h-32 justify-center items-center flex">
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
                v-show="showElement == index || status.uploading.findIndex(item => item == src) > -1"
                @mouseout="showElement = null">
                <UButton v-if="!status.uploading" variant="soft" :ui="{ rounded: 'rounded-full' }"
                  icon="i-material-symbols-light-visibility-outline-rounded" color="blue" />

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
          <div class="flex justify-center cursor-pointer" @click="disabled.submit ? '' : fileSelected.click()">
            <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400" />
          </div>
        </div>

        <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected" @change="previewSelected"
          multiple />
      </div>
    </UFormGroup>
    <UFormGroup label="Mô tả" name="description">
      <UTextarea v-model="category.description" :rows="6" :disabled="disabled.submit" />
    </UFormGroup>
    <UFormGroup label="Ghi chú" name="note">
      <UTextarea v-model="category.note" :rows="6" :disabled="disabled.submit" />
    </UFormGroup>
    <UFormGroup label="Tags" name="tags">
      <UTextarea v-model="category.tags" :rows="6" disabled />
    </UFormGroup>
    <div class="flex justify-end gap-1">
      <UButton :color="props.data ? 'blue' : 'green'" ref="myBtn" type="submit" :disabled="disabled.submit"
        :loading="disabled.submit">{{ props.data ? 'Cap nhat' : 'Tạo mới' }}</UButton>
      <UButton color="red" variant="ghost" @click="form.clear(), resetData()">Huỷ bỏ</UButton>
    </div>
    <div class="w-full h-full absolute -top-4 z-50  rounded-md cursor-wait" v-if="disabled.submit"></div>
  </UForm>

</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Create Category'
})
import type { _0 } from '#tailwind-config/theme/backdropBlur';
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { readUsedSize } from 'chart.js/helpers';
import { z } from 'zod'
const props = defineProps(['modelValue', 'data'])
const emits = defineEmits(['newData', 'updateData', 'doing'])
const sizeScreen = ref({
  w: null,
  h: null
})
function onResize() {
  sizeScreen.value.w = window.innerWidth
  sizeScreen.value.h = window.innerHeight
}
function resetData() {
  if (props.data) {
    Object.keys(category.value).forEach(item => {
      if (item != 'images' && item != 'imagesOld') {
        category.value[item] = props.data[item]
      }

    })
    Object.keys(category.value.imagesOld).forEach(item => {
      category.value.imagesOld[item] = []
      props.data.images[item].forEach(item1 => {
        category.value.imagesOld[item].push(item1)
      })
    })
    category.value.previewImages = []
  }
  else {
    category.value = {
      title: null,
      description: null,
      images: {
        original: [],
        medium: [],
        small: [],
        files: []
      },
      imagesOld: {
        original: [],
        medium: [],
        small: []
      },
      categories: [],
      note: null,
      previewImages: [],
      tags: null,
      _id: null,
      created_at: null,
      edited_at: null
    }
  }

}
function scrollToForm() {
  const element = form.value
  element.$el.scrollIntoView({ behavior: 'smooth' })
}
onBeforeMount(() => {
  resetData()
})
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
  imagesOld: {
    original: [],
    medium: [],
    small: []
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
const status = ref({
  uploading: [],
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
const validate = async (state: any): FormError[] => {
  const errors = []
  console.log(11111)
  if(state.title){
    if(oldTitle.value.data!=state.title){
      oldTitle.value.data=state.title
    await $fetch('/api/categories/get?'+new URLSearchParams({title:state.title})).then(res=>{
      if(res.length>0){
        errors.push({path:'title',message:'Title is existed'})
        oldTitle.value.error={path:'title',message:'Title is existed'}
      }
      else{
        oldTitle.value.error=null
      }
    })
    }
    else if(oldTitle.value.data==state.title && oldTitle.value.error){
      errors.push(oldTitle.value.error)
    }
    
  }
  return errors
}

type Schema = z.output<typeof schema>
async function onSubmit(event: FormSubmitEvent<Schema>) {
  disabled.value.submit = true
  emits('doing', disabled.value.submit)
  status.value.uploading = category.value.previewImages
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
          status.value.uploading = status.value.uploading.filter(item => item != category.value.previewImages[index])
        }
        if (index == category.value.images.files.length - 1) {
          meter.value.display = null
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
    let url = '/api/categories/create'
    if (props.data) {
      Object.keys(category.value.imagesOld).forEach(property => {
        category.value.imagesOld[property].forEach(item => {
          category.value.images[property].push(item)
        })
      })
      url = '/api/categories/update'
    }
    await $fetch(url, {
      body: JSON.stringify(category.value),
      method: props.data ? 'PUT' : 'POST'
    }).then(res => {
      disabled.value.submit = false
      if (!props.data) {
        if (Object.hasOwn(res[0], '_id')) {
          setTimeout(() => {
            inputField.value.$refs.input.focus()
          }, 1)
          emits('newData', res[0])
          resetData()
        }
      }
      else {
        if (Object.hasOwn(res, 'modifiedCount') && res.modifiedCount == 1) {
          emits('updateData', category.value)
        }
      }

      scrollToForm()
      status.value.uploading = []
      emits('doing', disabled.value.submit)
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

const oldTitle=ref({
  error:null,
  data:null
})

</script>

<style></style>