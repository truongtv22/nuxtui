<template>
  <UForm :schema="schema" class="space-y-4 relative w-full">
    <!----------------------------start create new form------------------------------>
    <div :class="`w-full ${createForm.value.length > 1 ? 'border' : ''} px-1 rounded-md border-gray-400 py-4 relative`"
      v-for="itemRoot, indexRoot in createForm.value" :ref="skipUnwrap.wrapForm">
      <UBadge class="absolute -top-3 -left-3" v-if="createForm.value.length > 1">#{{ indexRoot + 1 }}</UBadge>
      <UButton v-if="createForm.value.length > 1" @click="createForm.value.splice(indexRoot, 1)" color="red"
        class="absolute -top-3 -right-3" :ui="{ rounded: 'rounded-full' }" icon="i-material-symbols-light-close-small"
        square size="2xs"></UButton>
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
                <PreviewImage v-for="data, index in itemRoot.previewImages" :data :index
                  :loading="(index == meter.display && indexRoot == meter.indexForm) ? meter.data : null"
                  :status="(status.uploading && status.uploading.indexOf(data) > -1 && data.original.indexOf('blob')>-1) ? true : false"
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
      <UButton @click="onSubmit" :loading="status.loading" :disabled="status.loading"
        :color="props.data ? 'blue' : 'green'">{{ props.data ? 'Update' : 'Create' }}</UButton>
      <UButton color="red" variant="ghost" :loading="status.loading" :disabled="status.loading">Cancel</UButton>
    </div>
    <div v-if="status.loading" class="w-full absolute top-0 left-0 z-50 h-full cursor-wait"></div>
  </UForm>

</template>

<script lang="ts" setup>
import { z } from 'zod'
import PreviewImage from '~/components/PreviewImage.vue';

const notificationStore = useMyNotificationsStore()
const props = defineProps(['modelValue', 'data'])
const emits = defineEmits(['update:modelValue', 'confirmWindow', 'newData', 'doing'])
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
  await $fetch('/api/categories/list').then(res => {
    categoriesData.value = res
  })
  insertCreateForm()
  if (props.data) {
    setTimeout(() => {
      Object.keys(props.data).forEach(key => {
        
        if (key == 'images') {
          createForm.value.value[0][key].files = []
          props.data[key].forEach(item=>{
            createForm.value.value[0][key].push(item)
            createForm.value.value[0][key].files.push(null)
          })
          createForm.value.value[0].previewImages=props.data[key]
        }
        else{
          createForm.value.value[0][key] = props.data[key]
          if (key == 'name') {
          oldData.value.name = props.data[key]
        }
        }
      })
      createForm.value.value[0].categories = categoriesData.value.filter(item => createForm.value.value[0].categories.indexOf(item._id) > -1)
    }, 1)
  }

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
async function previewSelected(e, root) {
  for (let i = 0; i < e.srcElement.files.length; i++) {
    
    const file = e.srcElement.files[i]
    const resizedBlob=await resizeImage(file,300),
    resized=URL.createObjectURL(resizedBlob)
    let iss = false
    root.files.forEach(item => {
      if (item && item.name == file.name) {
        iss = true
      }
    })
    if (!iss) {
      root.previewImages.push({original:URL.createObjectURL(file),small:resized})
      root.files.push(file)
    }
  }
}
function removeImage(index, type, root) {
  switch (type) {
    case 'temp':
      root.previewImages.splice(index, 1)
      root.files.splice(index, 1)
      root.images.splice(index, 1)
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
  emits('doing', true)
  let firstPoint = null
  status.value.loading = true
  let i = createForm.value.value.length
  const formClones = []
  createForm.value.value.forEach(form => { formClones.push(form) })
  for await (const data of formClones) {
    const index = formClones.indexOf(data)
    const index1 = createForm.value.value.indexOf(data)
    const res = await schema.safeParse(data)
    let errors=[]
    let res1=[]
    if(oldData.value.name!=data.name){
      res1=await $fetch('/api/products/get?' + new URLSearchParams({ name: data.name })).then(resC => {
        if (resC.length > 0) {
          errors.push({ path: 'name', message: 'Name is existed' })
          oldData.value.error = { path: 'name', message: 'Name is existed' }
          form.value[index].setErrors([oldData.value.error])
        }
        else {
          oldData.value.error = null
          errors=[]
        }
        return errors
      })
    }
    
    wrapForm.value[index1].scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (res.success && res1.length==0) {
      const beforeData = {}
      meter.value.indexForm = index
      Object.keys(data).forEach(key => {
        beforeData[key] = data[key]
      })
      delete beforeData.previewImages
      const tempRoot = []
      if (beforeData.files.length > 0) {
        status.value.uploading = data.previewImages
        for await (const file of beforeData.files) {
          if(file){
            const temp={}
          meter.value.data = 0
          const indexChild = beforeData.files.indexOf(file)
          meter.value.display = indexChild
          let res = await uploadFile(file)
          if (res.status == 'success') {
            const myInterval = setInterval(() => {
              meter.value.data += 1
              if (meter.value.data == Math.round(100 / 3)) {
                clearInterval(myInterval)
              }
            }, 100)
            temp.original=res['data']['original']
          }
          res = await uploadFile(file, 300)
          if (res.status == 'success') {
            const myInterval = setInterval(() => {
              meter.value.data += 1
              if (meter.value.data == Math.round(200 / 3)) {
                clearInterval(myInterval)
              }
            }, 100)
            temp.medium=res['data']['original']
          }
          res = await uploadFile(file, 100)
          if (res.status == 'success') {
            const myInterval = setInterval(() => {
              meter.value.data += 1
              if (meter.value.data == 100) {
                clearInterval(myInterval)

              }
            }, 100)
            temp.small=res['data']['original']
            status.value.uploading = status.value.uploading.filter(item => item != data.previewImages[indexChild])
          }
          await new Promise((resolve, reject) => {
            tempRoot.push(temp)
            setTimeout(resolve, 1000)
          })
          if (indexChild == beforeData.files.length - 1) {
            
          }
          }
        }
      }
      status.value.uploading = null
      data.files=[]
      beforeData.images = props.data?beforeData.images.concat(tempRoot):tempRoot
      if(props.data){
        createForm.value.value[0].images=createForm.value.value[0].images.concat(tempRoot)
      }
      const temp1 = []
      beforeData.categories.forEach(item => {
        temp1.push(item._id)
      })
      beforeData.categories = temp1
      let res = await uploadData(beforeData)
      if (Object.hasOwn(res, 'type') && res.type == 'success') {
        oldData.value.name=data.name
        notificationStore.showNotification({
          title: `${data.name} <span class="text-${props.data ? 'blue' : 'green'}-500">${props.data ? 'updated' : 'created'}</span> success`,
          type: 'success'
        })
        if(!props.data){
          createForm.value.value.splice(index1, 1)
          emits('newData', res.data)
        }
        
      }
      else if (Object.hasOwn(res, 'type') && res.type == 'error') {
        notificationStore.showNotification({ title: `Error`, description: JSON.stringify(res.data), type: 'error' })
      }
      else {
        form.value[index].setErrors(res)
      }
    }
    if (index == i - 1) {
      emits('doing', false)
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
      return await $fetch(`/api/products/${props.data ? 'update' : 'create'}`, {
        method: props.data ? "PUT" : "POST",
        body: JSON.stringify(data)
      }).then(res => {
        if (props.data && res.modifiedCount == 1 || res.length > 0) {
          return { type: 'success', data: props.data ? data : res[0] }
        }
      }).catch(error => {
        return { type: 'error', data: error }
      })
    }
    return res
  })
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
    images: [],
    files:[],
    categories: [],
    note: null,
    previewImages: [],
    tags: null
  }
  createForm.value.value.push(form)
}
</script>

<style></style>