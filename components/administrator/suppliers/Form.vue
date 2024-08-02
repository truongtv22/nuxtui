<template>
  <UForm :schema="schema" class="space-y-4 relative w-full">
    <!----------------------------start create new form------------------------------>
    <template v-for="itemRoot, indexRoot in forms" :key="itemRoot._id">
      <div v-if="itemRoot"
        :class="`w-full ${forms.length > 1 ? 'border' : ''} px-1 rounded-md border-gray-400 py-4 relative`"
        :ref="skipUnwrap.elements">
        <UBadge class="absolute -top-3 -left-3" v-if="forms.length > 1">#{{ indexRoot + 1 }}</UBadge>
        <UButton v-if="forms.length > 1" @click="forms.splice(indexRoot, 1)" color="red"
          class="absolute -top-3 -right-3" :ui="{ rounded: 'rounded-full' }" icon="i-material-symbols-light-close-small"
          square size="2xs"></UButton>
        {{ itemRoot._id }}
        <AdministratorSuppliersForm1 :state="itemRoot" @status="response = $event"
          :submit="test == itemRoot ? true : null" :errors="itemRoot.errors" />


      </div>
    </template>

    <!----------------------------end create new form------------------------------>
    <UTooltip v-if="!props.data" text="Add more product" :popper="{ arrow: true }" class="w-full">
      <div ref="insertFormBtn"
        class="w-full border border-dotted cursor-pointer rounded-md flex justify-center py-1 dark:border-gray-700 border-gray-300"
        @click="insertForm">
        <UIcon class="text-3xl text-gray-500" name="i-material-symbols-light-exposure-plus-1-rounded"></UIcon>
      </div>
    </UTooltip>
    <div class="flex justify-end gap-1">
      <UButton @click="onSubmit" :loading="formProcessing" :disabled="formProcessing"
        :color="props.data ? 'blue' : 'green'">{{ props.data ? 'Update' : 'Create' }}</UButton>
      <UButton color="red" variant="ghost" :loading="formProcessing" :disabled="formProcessing">Cancel</UButton>
    </div>
    <div v-if="formProcessing" class="w-full absolute top-0 left-0 z-50 h-full cursor-wait"></div>
  </UForm>
</template>

<script lang="ts" setup>
import { z } from 'zod'
const props = defineProps([]),
  emits = defineEmits(['doing']),
  notificationStore = useMyNotificationsStore()

onBeforeMount(() => {
  insertForm()
})
const forms = ref([]),
  elements = ref([]),
  test = ref(null),
  schema = z.object({
    name: z.string({
      required_error: "Tên nha cung cap không để trống",
      invalid_type_error: "Tên nha cung cap không để trống",
    }).min(6, { message: 'Tên nha cung cap có độ dài ít nhất 6 ký tự' }),
    email:  z.string().email().optional().or(z.literal(''))
  })
const skipUnwrap = { elements }
const formProcessing = computed(() => {
  return forms.value.filter(item => {
    return item ? item.loading : item
  }).length > 0
})
function insertForm() {
  forms.value.push({
    name: null,
    email: '',
    contacts: [{
      address: null,
      phone: null
    }],
    created_at: null,
    created_by: null,
    edited_at: null,
    edited_by: null,
    description: null,
    note: null,
    tags: null,
    images: [],
    previewImages: [],
    refs: {
      file: null,
      main: null,
      form: null
    },
    status: {
      loading: false
    },
    errors:[]
  })
}
const response = ref(null)
async function onSubmit() {
  for await (const form of forms.value) {
    const validate = await schema.safeParse(form)
    const nameValid = await $fetch('/api/suppliers/get?' + new URLSearchParams({ name: form.name })).then(response => {
      return response.length < 1
    })
    await Promise.all([validate, nameValid]).then(([validate, nameValid]) => { 
      if(!validate.success){
        JSON.parse(validate.error).forEach(err => {
          form.errors.push({ path: err.path[0], message: err.message })
        })
      }
      if(validate.success && nameValid){
        console.log('done')
        forms.value=forms.value.filter(item=>item!=form)
      }
      if(forms.value.length<1){
        insertForm()
      }
    })
  }
}
async function processDone(index, data) {
  console.log(index, data)
}
async function onSubmit1() {
  let firstPoint = null
  emits('doing', true)
  const formsClone = []
  forms.value.data.forEach(item => formsClone.push(item))
  for await (const data of formsClone) {
    const index = formsClone.indexOf(data),
      indexForm = forms.value.data.indexOf(data)
    const isValid = await forms.value.schema.safeParse(data)
    const existedName = await $fetch('/api/suppliers/get?' + new URLSearchParams({ name: data.name })).then(response => {
      return response.length > 0
    })
    await Promise.all([isValid, existedName]).then(async ([isValid, existedName]) => {
      if (isValid.success && !existedName) {
        elements.value[indexForm].scrollIntoView({ behavior: 'smooth', block: 'start' })
        data.status.loading = true
        const dataPrepared = {}
        Object.keys(data).forEach(key => {
          dataPrepared[key] = data[key]
        })
        const promiseRoot = async () => {
          for await (const obj of dataPrepared.images) {
            const objIndex = dataPrepared.images.indexOf(obj)
            dataPrepared.previewImages[objIndex].meter.display = true
            const interval = setInterval(() => {
              if (dataPrepared.previewImages[objIndex].meter.value < 100) {
                dataPrepared.previewImages[objIndex].meter.value += 1
              }
              if (dataPrepared.previewImages[objIndex].meter.value == 100) {
                clearInterval(interval)
              }
            }, 100)
            await uploadFile(obj.file).then(async (res) => {
              if (res.status == 'success') {
                obj.original = res.data.original
                return await uploadFile(obj.file, 300)
              }
            }).then(async (res) => {
              if (res?.status == 'success') {
                obj.medium = res.data.original
                return await uploadFile(obj.file, 100)
              }
            }).then(res => {
              if (res?.status == 'success') {
                obj.small = res.data.original
                dataPrepared.previewImages[objIndex].meter.value = 100
                dataPrepared.previewImages[objIndex].meter.display = false
                clearInterval(interval)
                //resolveRoot()

              }
              if (objIndex == dataPrepared.images.length - 1) {
                return true
              }
            })
          }
          if (dataPrepared.images.length == 0) {
            return true
          }
        }
        await promiseRoot().then(async (response) => {
          data.status.loading = false
          delete dataPrepared.previewImages
          delete dataPrepared.status
          delete dataPrepared.refs
          await $fetch('/api/suppliers/create', {
            method: "POST",
            body: JSON.stringify(dataPrepared)
          }).then(response => {
            if (response.length > 0) {
              notificationStore.showNotification({ type: 'success', title: `${response[0].name} <span class="text-${props.data ? 'blue' : 'green'}-500 font-bold">${props.data ? 'updated' : 'created'}</span> success` })
              forms.value.data.splice(indexForm, 1)
              console.log(1111)
            }
          })

        })
      }
      if (existedName) {

      }
      if (index == formsClone.length - 1) {
        emits('doing', false)
        if (forms.value.data.length < 1) {
          insertForm()
        }
        else {
          console.log(forms.value.data)
          for (const data of forms.value.data) {
            const valid = await forms.value.schema.safeParse(data)
            if (valid) {
              const errors = []
              JSON.parse(valid.error).forEach(err => {
                errors.push({ path: err.path[0], message: err.message })
              })
              data.refs.form.setErrors(errors)

            }
          }
          elements.value[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

    })
  }
}
async function uploadFile(file, size = null) {
  if (size) {
    let blob = await resizeImage(file, size)
    file = new File([blob], file.name, file)
  }
  let data = new FormData()
  data.append('file', file)
  return await $fetch('/api/uploads/image', {
    method: "POST",
    body: data
  }).then(async res => {
    return {
      status: 'success',
      data: {
        original: res['data']['original'],
        small: res['data'].original,
        medium: res.data.original
      }

    }
  }).catch(error => {
    return {
      status: 'error',
      data: {
        original: null,
        small: null,
        medium: null
      }

    }
  })
}
async function previewSelected(e, root) {
  for (let i = 0; i < e.srcElement.files.length; i++) {

    const file = e.srcElement.files[i]
    const resizedBlob = await resizeImage(file, 300),
      resized = URL.createObjectURL(resizedBlob)
    let iss = false
    root.images.forEach(item => {
      if (item && item.file == file.name) {
        iss = true
      }
    })
    if (!iss) {
      root.previewImages.push({
        original: URL.createObjectURL(file),
        small: resized,
        meter: {
          display: false,
          value: 0
        }
      })
      root.images.push({ file })
    }
  }
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
</script>

<style></style>