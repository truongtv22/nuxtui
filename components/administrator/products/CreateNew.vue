<template>
  
      <UForm :schema="schema" class="space-y-4 relative w-full">
        <!----------------------------start create new form------------------------------>
        <div
          :class="`w-full ${createForm.value.length > 1 ? 'border' : ''} px-1 rounded-md border-gray-400 py-4 relative`"
          v-for="itemRoot, indexRoot in createForm.value" :ref="skipUnwrap.wrapForm">
          <UBadge class="absolute -top-3 -left-3" v-if="createForm.value.length > 1">#{{ indexRoot + 1 }}</UBadge>
          <UButton v-if="createForm.value.length > 1" @click="createForm.value.splice(indexRoot, 1)" color="red"
            class="absolute -top-3 -right-3" :ui="{ rounded: 'rounded-full' }"
            icon="i-material-symbols-light-close-small" square size="2xs"></UButton>
          <UForm ref="form" :schema="schema" :state="itemRoot">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-4">
              <UFormGroup label="Tên sản phẩm" name="name">
                <UInput ref="names" v-model="itemRoot.name" @keyup.enter="onSubmit(), $event.target.blur()" />
              </UFormGroup>
              <UFormGroup label="Barcode" name="barcode">
                <UButtonGroup class="w-full">
                  <UInput v-model="itemRoot.barcode" class="w-full" />
                  <UButton icon="i-material-symbols-light-barcode-scanner-rounded" />
                </UButtonGroup>
              </UFormGroup>
            </div>
            <UFormGroup label="Categories" name="categories">
              <AdministratorCategoriesSelectList :data="categoriesData" @selected="itemRoot.categories = $event"
                :selected="itemRoot.categories" />
            </UFormGroup>
            <UFormGroup label="Photos" name="images">
              <div
                :class="'min-h-32 w-full border border-dotted border-2 rounded-md ' + (itemRoot.previewImages.length < 1 ? ' cursor-pointer' : '')">
                <div v-if="itemRoot.previewImages.length == 0" @click="fileSelected1[indexRoot].click()"
                  class="w-full min-h-32 justify-center items-center flex">
                  <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                    class="text-7xl text-gray-400" />
                </div>

                <div v-else class="grid grid-cols-1">
                  <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
                    <PreviewImage v-for="src, index in itemRoot.previewImages" :src :index
                      :loading="(index == meter.display && indexRoot == meter.indexForm) ? meter.data : null"
                      :status="(status.uploading && status.uploading.indexOf(src) > -1) ? true : false"
                      @remove="removeImage($event, 'temp', itemRoot)" />
                  </div>
                  <UDivider />
                  <div class="flex justify-center cursor-pointer" @click="fileSelected1[indexRoot].click()">
                    <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                      class="text-7xl text-gray-400" />
                  </div>
                </div>

                <input type="file" class="hidden" accept=".jpg, .jpeg, .png" ref="fileSelected1"
                  @change="previewSelected($event, itemRoot)" multiple />
              </div>
            </UFormGroup>
            <UFormGroup label="Description" name="description">
              <UTextarea v-model="itemRoot.description" rows="6" />
            </UFormGroup>
            <UFormGroup label="Note" name="note">
              <UTextarea v-model="itemRoot.note" rows="6" />
            </UFormGroup>
            <UFormGroup label="Tags" name="tags">
              <UTextarea v-model="itemRoot.tags" rows="6" disabled />
            </UFormGroup>
          </UForm>
        </div>
        <!----------------------------end create new form------------------------------>
        <UTooltip v-if="!props.data" text="Add more product" :popper="{ arrow: true }" class="w-full">
          <div ref="createFormBtn"
            class="w-full border border-dotted cursor-pointer rounded-md flex justify-center py-1 dark:border-gray-700 border-gray-300"
            @click="insertCreateForm">
            <UIcon class="text-3xl text-gray-500" name="i-material-symbols-light-exposure-plus-1-rounded"></UIcon>
          </div>
        </UTooltip>
        <div class="flex justify-end gap-1">
          <UButton @click="onSubmit" :loading="status.loading" :disabled="status.loading">Create</UButton>
          <UButton color="red" variant="ghost" :loading="status.loading" :disabled="status.loading">Cancel</UButton>
        </div>
        <div v-if="status.loading" class="w-full absolute top-0 left-0 z-50 h-full cursor-wait"></div>
      </UForm>

</template>

<script lang="ts" setup>
import { z } from 'zod'
import PreviewImage from '~/components/PreviewImage.vue';

const notificationStore = useMyNotificationsStore()
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue', 'confirmWindow', 'newData','doing'])
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
onBeforeMount(async () => {
  insertCreateForm()
  await $fetch('/api/categories/list').then(res => {
    categoriesData.value = res
  })
})
const createForm = ref({
  value: []
})
const names = ref(null)
const selected = ref([])
const status = ref({
  loading: false,
  uploading: null
})
const wrapForm = ref([]),
  skipUnwrap = { wrapForm },
  skipUnwrap1 = { selected },
  fileSelected1 = ref([]),
  categoriesData = ref([]),
  form = ref([])
const product = ref({
  name: null,
  barcode: null,
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
}),
  oldData = ref({
    name: null,
    error: null
  })
const meter = ref({
  display: null,
  data: 0,
  indexForm: null
})
const categoriesSelected = computed({
  get: () => product.value.categories.value,
  set: async (val) => {
    const arr = val.map(async (item) => {
      if (item._id) {
        return item
      }
      status.value.loading = true
      return await $fetch('/api/categories/create', {
        method: "POST",
        body: JSON.stringify({
          title: item.title
        })
      }).then(res => {
        if (res.length > 0) {
          product.value.categories.data.push(res[0])
          status.value.loading = false
          return res[0]
        }
      })
    })
    product.value.categories.value = await Promise.all(arr)
  }
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
      root.
        images.files.splice(index, 1)
      break
    case 'old':
      Object.keys(product.value.imagesOld).forEach(property => {
        root.imagesOld[property].splice(index, 1)
      })
      break
  }
}
const schema = z.object({
  name: z.string({
    required_error: "Tên product không để trống",
    invalid_type_error: "Tên product không để trống",
  }).min(6, { message: 'Tên product có độ dài ít nhất 6 ký tự' }),
  categories: z.any().array().min(1, { message: 'Lua chon it nhat 1 nganh san pham' })
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emits('doing',true)
  let firstPoint = null
  status.value.loading = true
  let i = createForm.value.value.length
  const formClones = []
  createForm.value.value.forEach(form => { formClones.push(form) })
  for await (const data of formClones) {
    const index = formClones.indexOf(data)
    const index1 = createForm.value.value.indexOf(data)
    const res = await schema.safeParse(data)
    wrapForm.value[index1].scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (res.success) {
      const beforeData = {}
      meter.value.indexForm = index
      Object.keys(data).forEach(key => {
        beforeData[key] = data[key]
      })
      delete beforeData.previewImages
      const temp = {
        original: [],
        medium: [],
        small: []
      }
      if (beforeData.images.files.length > 0) {
        status.value.uploading = data.previewImages
        for await (const file of beforeData.images.files) {
          meter.value.data = 0
          const indexChild = beforeData.images.files.indexOf(file)
          meter.value.display = indexChild
          let res = await uploadFile(file)
          if (res.status == 'success') {
            const myInterval = setInterval(() => {
              meter.value.data += 1
              if (meter.value.data == Math.round(100 / 3)) {
                clearInterval(myInterval)
              }
            }, 100)
            temp.original.push(res['data']['original'])
          }
          res = await uploadFile(file, 300)
          if (res.status == 'success') {
            const myInterval = setInterval(() => {
              meter.value.data += 1
              if (meter.value.data == Math.round(200 / 3)) {
                clearInterval(myInterval)
              }
            }, 100)
            temp.medium.push(res['data']['original'])
          }
          res = await uploadFile(file, 100)
          if (res.status == 'success') {
            const myInterval = setInterval(() => {
              meter.value.data += 1
              if (meter.value.data == 100) {
                clearInterval(myInterval)

              }
            }, 100)
            temp.small.push(res['data']['original'])
            status.value.uploading = status.value.uploading.filter(item => item != data.previewImages[indexChild])
          }
          await new Promise((resolve, reject) => {
            setTimeout(resolve, 1000)
          })
          if (indexChild == beforeData.images.files.length - 1) {
            status.value.uploading = null
          }

        }
      }
      beforeData.images = temp
      const temp1 = []
      beforeData.categories.forEach(item => {
        temp1.push(item._id)
      })
      beforeData.categories = temp1
      let res = await uploadData(beforeData)
      if (Object.hasOwn(res,'type') && res.type == 'success') {
        notificationStore.showNotification({ title: `${data.name} created success`, description: 'Its online now', type: 'success' })
        createForm.value.value.splice(index1, 1)
        emits('newData', res.data)
      }
      else if (Object.hasOwn(res,'type') && res.type == 'error') {
        notificationStore.showNotification({ title: `Error`, description: JSON.stringify(res.data), type: 'error' })
      }
      else{
        form.value[index].setErrors(res)
      }
    }
    if (index == i - 1) {
      emits('doing',false)
      status.value.loading = false
      for await (const data of createForm.value.value) {
        const index = createForm.value.value.indexOf(data)
        const res = await schema.safeParse(data)
        if (res.success == false) {
          if (firstPoint == null) {
            firstPoint = index
            wrapForm.value[index].scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          const errors = []
          JSON.parse(res.error).forEach(err => {
            errors.push({ path: err.path[0], message: err.message })
          })
          form.value[index].setErrors(errors)
        }
      }

      if (createForm.value.value.length < 1) {
        insertCreateForm()
        setTimeout(() => {
          names.value[0].$refs.input.focus()
        }, 1)

      }

    }
  }
}
async function uploadData(data) {
  const errors = []
  const checking = new Promise(async (resolve, reject) => {
    if (oldData.value.name != data.name) {
      await $fetch('/api/products/get?' + new URLSearchParams({ name: data.name })).then(res => {
        if (res.length > 0) {
          errors.push({ path: 'name', message: 'Name is existed' })
          oldData.value.error = { path: 'name', message: 'Name is existed' }
          //form.value.setErrors([oldData.value.error])
        }
        else {
          oldData.value.error = null
        }
        resolve(errors)
      })
    }
    else {
      resolve(errors)
    }
  })
  const result = checking.then(async (res) => {
    if (res.length < 1) {
      return await $fetch('/api/products/create', {
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => {
        if (res.length > 0) {
          return { type: 'success', data: res[0] }
        }
      }).catch(error => {
        return { type: 'error', data: error }
      })
    }
    return res
  })
  console.log(result)
  return result
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

function insertCreateForm() {
  const form = {
    name: null,
    barcode: null,
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
  createForm.value.value.push(form)
}
</script>

<style></style>