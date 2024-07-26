<template>
  <UForm ref="form" :schema="schema" :state="category" class="space-y-4 relative" @submit="onSubmit" @error="onError">
    <UFormGroup label="Tên thể loại" name="title">
      <template #hint>
        <span class="text-gray-400 dark:text-gray-500">Required</span>
      </template>
      <UInput ref="inputField" v-model="category.title" @keyup.enter="form.submit()" :disabled="disabled.submit" />
    </UFormGroup>
    <UFormGroup label="Hình ảnh" name="images">
      <div :class="'min-h-32 w-full border border-dotted border-2 rounded-md '">
        <div v-if="category.imagesOld.medium.length == 0 && category.previewImages.length == 0"
          @click="disabled.submit ? '' : fileSelected.click()" class="w-full min-h-32 justify-center items-center flex">
          <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400" />
        </div>

        <div v-else class="grid grid-cols-1">

          <div class="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 p-2 gap-2">
            <div v-for="src, index in category.previewImages" class="relative">
              <img :src class="rounded-md w-full min-h-52 max-h-52 object-cover" :key="index"
                @mouseover="showElement = src" />
              <div class="absolute top-1/2 p-2 w-full z-50">
                <UMeter :value="meter.data" v-if="meter.display == index && formProcessing.index == 0"></UMeter>
              </div>
              <div
                class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md cursor-pointer"
                v-show="showElement == index || status.uploading.findIndex(item => item == src) > -1"
                @mouseout="showElement = null">
                <UButton v-if="!status.uploading" variant="soft" :ui="{ rounded: 'rounded-full' }"
                  icon="i-material-symbols-light-visibility-outline-rounded" color="blue" />

              </div>
              <div
                class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer"
                @click="removeImage(index, 'temp', category)">
                <UIcon name="i-material-symbols-light-close-small-outline-rounded" />
              </div>
            </div>
            <div v-for="src, index in category.imagesOld.medium" class="relative">
              <NuxtImg class="rounded-md w-full min-h-52 max-h-52 object-cover" :src loading="lazy"
                @mouseover="showElement = src" :key="index" quality="10" placeholder densities="x1 x2" />
              <div
                class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md cursor-pointer"
                v-show="showElement == src" @mouseout="showElement = null">
                <UButton variant="soft" :ui="{ rounded: 'rounded-full' }"
                  icon="i-material-symbols-light-visibility-outline-rounded" color="blue"
                  @click="emits('modal', { data: category.imagesOld.original[index], display: true })" />

              </div>
              <div
                class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer"
                @click="removeImage(index, 'old', category)">
                <UIcon name="i-material-symbols-light-close-small-outline-rounded" />
              </div>
            </div>
          </div>
          <UDivider />
          <div class="flex justify-center cursor-pointer" @click="disabled.submit ? '' : fileSelected.click()">
            <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400" />
          </div>
        </div>

        <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected"
          @change="previewSelected($event, category)" multiple />
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

    <!-------------------create form----------------------------------------------------->
    <div class="w-full border px-1 rounded-md border-gray-400 py-4 relative" v-for="item, index in createForm.value"
      :ref="skipUnwrap.wrapForm">
      <UBadge class="absolute -top-3 -left-3">#{{ index + 1 }}</UBadge>
      <UButton @click="createForm.value.splice(index, 1)" color="red" class="absolute -top-3 -right-3"
        :ui="{ rounded: 'rounded-full' }" icon="i-material-symbols-light-close-small" square size="2xs"></UButton>
      <UForm ref="form1" :schema="schema" :state="item">
        <UFormGroup label="Tên thể loại" name="title">
          <template #hint>
            <span class="text-gray-400 dark:text-gray-500">Required</span>
          </template>
          <UInput ref="inputField" v-model="item.title" @keyup.enter="form.submit()" :disabled="disabled.submit" />
        </UFormGroup>
        <UFormGroup label="Hình ảnh" name="images">
          <div :class="'min-h-32 w-full border border-dotted border-2 rounded-md '">
            <div v-if="item.imagesOld.medium.length == 0 && item.previewImages.length == 0"
              @click="disabled.submit ? '' : fileSelected1[index].click()"
              class="w-full min-h-32 justify-center items-center flex">
              <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                class="text-7xl text-gray-400" />
            </div>

            <div v-else class="grid grid-cols-1">

              <div class="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 p-2 gap-2">
                <div v-for="src, indexC in item.previewImages" class="relative">
                  <img :src class="rounded-md w-full min-h-52 max-h-52 object-cover" :key="indexC"
                    @mouseover="showElement = src" />
                  <div class="absolute top-1/2 p-2 w-full z-50">
                    <UMeter :value="meter.data" v-if="meter.display == indexC && formProcessing.index == (index + 1)"></UMeter>
                  </div>
                  <div
                    class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md cursor-pointer"
                    v-show="showElement == indexC || status.uploading.findIndex(item => item == src) > -1"
                    @mouseout="showElement = null">
                    <UButton v-if="!status.uploading" variant="soft" :ui="{ rounded: 'rounded-full' }"
                      icon="i-material-symbols-light-visibility-outline-rounded" color="blue" />

                  </div>
                  <div
                    class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer"
                    @click="removeImage(indexC, 'temp', item)">
                    <UIcon name="i-material-symbols-light-close-small-outline-rounded" />
                  </div>
                </div>
                <div v-for="src, indexC in item.imagesOld.medium" class="relative">
                  <NuxtImg class="rounded-md w-full min-h-52 max-h-52 object-cover" :src loading="lazy"
                    @mouseover="showElement = src" :key="indexC" quality="10" placeholder densities="x1 x2" />
                  <div
                    class="w-full min-h-52 max-h-52 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center rounded-md cursor-pointer"
                    v-show="showElement == src" @mouseout="showElement = null">
                    <UButton variant="soft" :ui="{ rounded: 'rounded-full' }"
                      icon="i-material-symbols-light-visibility-outline-rounded" color="blue"
                      @click="emits('modal', { data: item.imagesOld.original[indexC], display: true })" />

                  </div>
                  <div
                    class="absolute -top-2 -right-2 z-50 text-white text-xl bg-red-500 rounded-full  flex justify-center items-center cursor-pointer"
                    @click="removeImage(indexC, 'old', item)">
                    <UIcon name="i-material-symbols-light-close-small-outline-rounded" />
                  </div>
                </div>
              </div>
              <UDivider />
              <div class="flex justify-center cursor-pointer"
                @click="disabled.submit ? '' : fileSelected1[index].click()">
                <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                  class="text-7xl text-gray-400" />
              </div>
            </div>

            <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected1"
              @change="previewSelected($event, item)" multiple />
          </div>
        </UFormGroup>
        <UFormGroup label="Mô tả" name="description">
          <UTextarea v-model="item.description" :rows="6" :disabled="disabled.submit" />
        </UFormGroup>
        <UFormGroup label="Ghi chú" name="note">
          <UTextarea v-model="item.note" :rows="6" :disabled="disabled.submit" />
        </UFormGroup>
        <UFormGroup label="Tags" name="tags">
          <UTextarea v-model="item.tags" :rows="6" disabled />
        </UFormGroup>
      </UForm>
    </div>

    <!--end create form-->

    <UTooltip v-if="!props.data" text="Add more category" :popper="{ arrow: true }" class="w-full">
      <div ref="createFormBtn"
        class="w-full border border-dotted cursor-pointer rounded-md flex justify-center py-1 dark:border-gray-700 border-gray-300"
        @click="insertCreateForm">
        <UIcon class="text-3xl text-gray-500" name="i-material-symbols-light-exposure-plus-1-rounded"></UIcon>
      </div>
    </UTooltip>

    <div class="flex justify-end gap-1">
      <UButton :color="props.data ? 'blue' : 'green'" ref="myBtn" type="submit" :disabled="disabled.submit"
        :loading="disabled.submit">{{ props.data ? 'Cap nhat' : 'Tạo mới' }}</UButton>
      <UButton color="red" variant="ghost" @click="form.clear(), resetData()">Huỷ bỏ</UButton>
    </div>
    <div class="w-full h-full absolute -top-4 z-50  rounded-md cursor-wait" v-if="disabled.submit"></div>
  </UForm>
</template>

<script lang="ts" setup>
import type { _0 } from '#tailwind-config/theme/backdropBlur';
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { readUsedSize } from 'chart.js/helpers';
import { Schema, z } from 'zod'

const notiStore = useMyNotificationsStore()
const basicStore=useMyBasicStore()
const props = defineProps(['data'])
const emits = defineEmits(['newData', 'updateData', 'doing', 'modal'])
useSeoMeta({
  title: `${props.data ? `${props.data.title} >` : 'Create'} Category`
})

const createFormBtn = ref(null)
const createForm = ref({
  value: []
})


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
    oldTitle.value.data = category.value.title
    console.log(category.value)
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

})

const form = ref(),
  form1 = ref([]),
  wrapForm = ref([]),
  skipUnwrap = { wrapForm },
  fileSelected1 = ref([]),
  formProcessing = ref({
    index: null,
    length: null
  })
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
function previewSelected(e, root) {
  for (let i = 0; i < e.srcElement.files.length; i++) {
    const file = e.srcElement.files[i]
    let iss = false
    root.images.files.forEach(item => {
      if (item.name == file.name) {
        iss = true
      }
    })
    if (!iss) {
      root.previewImages.push(URL.createObjectURL(file))
      root.images.files.push(file)
    }
  }
}
function removeImage(index, type, root) {
  switch (type) {
    case 'temp':
      root.previewImages.splice(index, 1)
      root.images.files.splice(index, 1)
      break
    case 'old':
      Object.keys(category.value.imagesOld).forEach(property => {
        root.imagesOld[property].splice(index, 1)
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
  if (state.title && !props.data || (props.data && state.title != props.data.title)) {
    const promise = new Promise(async (resolve, reject) => {
      if (oldTitle.value.data != state.title) {
        //disabled.value.submit=true
        await $fetch('/api/categories/get?' + new URLSearchParams({ title: state.title })).then(res => {
          if (res.length > 0) {
            errors.push({ path: 'title', message: 'Title is existed' })
            oldTitle.value.error = { path: 'title', message: 'Title is existed' }
          }
          else {
            oldTitle.value.error = null
          }
          resolve(errors)
        })
      }
      else if (oldTitle.value.data == state.title && oldTitle.value.error) {
        errors.push(oldTitle.value.error)
        resolve(errors)
      }
    })

  }
  //disabled.value.submit=false
  return errors
}

type Schema = z.output<typeof schema>
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const promise = new Promise(async (resolve, reject) => {
    let isCorrect = true
    let firstPoint = null
    if (createForm.value.value.length > 0) {
      for (const item of createForm.value.value) {
        const index = createForm.value.value.indexOf(item)
        const res = await schema.safeParse(createForm.value.value[index])
        if (res.success == false) {
          if (firstPoint == null) {
            firstPoint = index
          }
          const err = JSON.parse(res.error)[0]
          isCorrect = false
          form1.value[index].setErrors([{ path: err.path[0], message: err.message }])
        }
        if (index == createForm.value.value.length - 1) {
          if (firstPoint) {
            skipUnwrap.wrapForm.value[firstPoint].scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          resolve(isCorrect)
        }
      }
    }
    else {
      resolve(isCorrect)
    }
  })
  promise.then(async (res) => {
    if (res) {
      const items = []
      items.push(category.value)
      createForm.value.value.forEach(item => items.push(item))
      disabled.value.submit = true
      emits('doing', disabled.value.submit)
      formProcessing.value.length = items.length
      for (let i = 0; i < items.length; i++) {
        const itemRoot = items[i]
        await singleUpload(itemRoot, items)
      }
    }
  })


}
function singleUpload(itemRoot, items) {
  return new Promise((resolveRoot) => {
    const indexRoot = items.indexOf(itemRoot)
    formProcessing.value.index = indexRoot
    status.value.uploading = itemRoot.previewImages
    const temp = {
      original: [],
      medium: [],
      small: []
    }
    const promises = []
    const errors = []
    const checking = new Promise(async (resolve, reject) => {
      if (oldTitle.value.data != itemRoot.title) {
        await $fetch('/api/categories/get?' + new URLSearchParams({ title: itemRoot.title })).then(res => {
          if (res.length > 0) {
            errors.push({ path: 'title', message: 'Title is existed' })
            oldTitle.value.error = { path: 'title', message: 'Title is existed' }
            form.value.setErrors([oldTitle.value.error])
          }
          else {
            oldTitle.value.error = null
          }
          resolve(errors)
        })
      }
      else {
        resolve(errors)
      }
    })
    checking.then(res => {
      if (res.length < 1) {
        const promise = new Promise(async (resolve, reject) => {
          if (itemRoot.images.files.length > 0) {
            for await (const [index, item] of itemRoot.images.files.entries()) {
              meter.value.display = index
              console.log(index)
              meter.value.data = 0
              const nums = Array.from(Array(101), (_, x) => x);
              for (const x of nums) {
                setTimeout(() => { meter.value.data = x }, 500)
              }
              let res = await uploadFile(item)
              if (res.status == 'success') {
                meter.value.data = 100 / 3
                temp.original.push(res['data']['original'])
              }
              res = await uploadFile(item, 300)
              if (res.status == 'success') {
                meter.value.data = 200 / 3
                temp.medium.push(res['data']['medium'])
              }
              res = await uploadFile(item, 100)
              if (res.status == 'success') {
                meter.value.data = 100
                temp.small.push(res['data']['small'])
                status.value.uploading = status.value.uploading.filter(item => item != itemRoot.previewImages[index])

              }
              if (meter.value.data < 100) {
                notiStore.showNotification({ type: 'error', title: 'Error: ' + res.data, description: 'Can\'t upload image. Please try again!' })

              }
              if (index == itemRoot.images.files.length - 1) {
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
          itemRoot.images.original = temp.original
          itemRoot.images.small = temp.small
          itemRoot.images.medium = temp.medium
          let url = '/api/categories/create'
          if (props.data) {
            Object.keys(itemRoot.imagesOld).forEach(property => {
              itemRoot.imagesOld[property].forEach(item => {
                itemRoot.images[property].push(item)
              })
            })
            url = '/api/categories/update'
          }
          await $fetch(url, {
            body: JSON.stringify(itemRoot),
            method: props.data ? 'PUT' : 'POST'
          }).then(res => {
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
            if (indexRoot == items.length - 1) {
              disabled.value.submit = false
              scrollToForm()
              createForm.value.value = []
              status.value.uploading = []
              emits('doing', disabled.value.submit)
              oldTitle.value.data = category.value.title
            }
            return resolveRoot()
          })
        })
      }
      else {
        disabled.value.submit = false
        emits('doing', disabled.value.submit)
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
async function uploadFile(file, size = null) {
  if (size) {
    let blob = await resizeImage(file, size)
    file = new File([blob], file.name, file)
  }
  let data = new FormData()
  data.append('file', file)
  const promise = new Promise(async (resolve, reject) => {
    await $fetch('/api/uploads/image', {
      method: "POST",
      body: data
    }).then(async res => {
      resolve({
        status: 'success',
        data: {
          original: res['data']['original'],
          small: res['data'].original,
          medium: res.data.original
        }

      })
    }).catch(error => {
      resolve({
        status: 'error',
        data: {
          original: null,
          small: null,
          medium: null
        }

      })
    })
  })
  return promise
}

const oldTitle = ref({
  error: null,
  data: null
})
function insertCreateForm() {
  const form = {
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
    edited_at: null,
    fileSelected: null
  }
  createForm.value.value.push(form)
}
</script>

<style></style>