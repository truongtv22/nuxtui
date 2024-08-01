<template>
  <UForm :schema="schema" class="space-y-4 relative w-full">
    <!----------------------------start create new form------------------------------>
    <div :class="`w-full ${forms.data.length > 1 ? 'border' : ''} px-1 rounded-md border-gray-400 py-4 relative`"
      v-for="itemRoot, indexRoot in forms.data" :ref="skipUnwrap.elements">
      <UBadge class="absolute -top-3 -left-3" v-if="forms.data.length > 1">#{{ indexRoot + 1 }}</UBadge>
      <UButton v-if="forms.data.length > 1" @click="forms.data.splice(indexRoot, 1)" color="red"
        class="absolute -top-3 -right-3" :ui="{ rounded: 'rounded-full' }" icon="i-material-symbols-light-close-small"
        square size="2xs"></UButton>
      <UForm :ref="el => itemRoot.refs.form = el" :schema="forms.schema" :state="itemRoot">
        <UFormGroup label="Tên nha cung cap" name="name">
          <UInput ref="names" v-model="itemRoot.name" @keyup.enter="onSubmit(), $event.target.blur()" />
        </UFormGroup>
        <UFormGroup label="Contacts" name="contacts">
          <div class="flex flex-col gap-y-2">
            <UFormGroup name="email">
              <UInput placeholder="Email" v-model="itemRoot.email" class="">
                <template #leading>
                  <UIcon name="i-material-symbols-light-mail-rounded"></UIcon>
                </template>
              </UInput>
            </UFormGroup>
            <div class="grid grid-cols-1 gap-x-1 relative " v-for="item, index in itemRoot.contacts">
              <UDivider :label="`#${index + 1}`" v-if="itemRoot.contacts.length > 1" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-1">
                <UInput placeholder="Address" v-model="item.address">
                  <template #leading>
                    <UIcon name="i-material-symbols-light-location-on-rounded" />
                  </template>
                </UInput>
                <UInput placeholder="Phone number" v-model="item.phone">
                  <template #leading>
                    <UIcon name="i-material-symbols-light-phone-iphone-sharp" />
                  </template>
                </UInput>
              </div>
              <div v-if="itemRoot.contacts.length > 1"
                class="absolute top-0 right-0 bg-red-500 flex items-center justify-center rounded-full cursor-pointer"
                @click="itemRoot.contacts.splice(index, 1)">
                <UIcon name="i-material-symbols-light-close-small-rounded" class=" text-white" />
              </div>
            </div>
            <UButton class="w-full text-center flex justify-center" variant="soft" label="Add more contact"
              @click="itemRoot.contacts.push({ address: null, phone: null })"></UButton>
          </div>

        </UFormGroup>
        <UFormGroup label="Photos" name="images">
          <div
            :class="'min-h-32 w-full border border-dotted border-2 rounded-md ' + (itemRoot.previewImages.length < 1 ? ' cursor-pointer' : '')">
            <div v-if="itemRoot.previewImages.length == 0" @click="itemRoot.refs.file.click()"
              class="w-full min-h-32 justify-center items-center flex">
              <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                class="text-7xl text-gray-400" />
            </div>

            <div v-else class="grid grid-cols-1">
              <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
                <PreviewImage v-for="data, index in itemRoot.previewImages" :data :index :loading="data.meter.value"
                  :status="data.meter.display" @remove="itemRoot.previewImages.splice(index, 1)" />
              </div>
              <UDivider />
              <div class="flex justify-center cursor-pointer" @click="itemRoot.refs.file.click()">
                <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded"
                  class="text-7xl text-gray-400" />
              </div>
            </div>

            <input type="file" class="hidden" accept=".jpg, .jpeg, .png" :ref="el => itemRoot.refs.file = el"
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
const forms = ref({
  data: [],
  schema: z.object({
    name: z.string({
      required_error: "Tên nha cung cap không để trống",
      invalid_type_error: "Tên nha cung cap không để trống",
    }).min(6, { message: 'Tên nha cung cap có độ dài ít nhất 6 ký tự' }),
    email: z.union([z.literal(''), z.string().email()])
  })
}),
elements=ref([])
const skipUnwrap={elements}
const formProcessing = computed(() => {
  return forms.value.data.filter(item => item.status.loading).length > 0
})
function insertForm() {
  const template = {
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
    }
  }
  forms.value.data.push(template)
}
async function onSubmit() {
  let firstPoint = null
  emits('doing', true)
  const formsClone = []
  forms.value.data.forEach(item => formsClone.push(item))
  for await (const data of formsClone) {
    const index = formsClone.indexOf(data),
    index1=forms.value.data.indexOf(data)
    console.log(index)
    const isValid = await forms.value.schema.safeParse(data)
    const existedName = await $fetch('/api/suppliers/get?' + new URLSearchParams({ name: data.name })).then(response => {
      return response.length > 0
    })
    await Promise.all([isValid, existedName]).then(async ([isValid, existedName]) => {
      if (isValid.success && !existedName) {
        elements.value[index1].scrollIntoView({ behavior: 'smooth', block: 'start' })
        data.status.loading = true
        const dataPrepared = {}
        Object.keys(data).forEach(key => {
          dataPrepared[key] = data[key]
        })
        const promiseRoot = async () => {
          for await (const obj of dataPrepared.images){
            const objIndex=dataPrepared.images.indexOf(obj)
            dataPrepared.previewImages[objIndex].meter.display=true
            const interval=setInterval(()=>{
              if(dataPrepared.previewImages[objIndex].meter.value<100){
                dataPrepared.previewImages[objIndex].meter.value+=1
              }
              if(dataPrepared.previewImages[objIndex].meter.value==100){
                clearInterval(interval)
              }
            },100)
            return await uploadFile(obj.file).then(async (res)=>{
              if(res.status=='success'){
                obj.original=res.data.original
                return await uploadFile(obj.file,300)
              }
            }).then(async(res)=>{
              if(res?.status=='success'){
                obj.medium=res.data.original
                return await uploadFile(obj.file,100)
              }
            }).then(res=>{
              if(res?.status=='success'){
                obj.small=res.data.original
                dataPrepared.previewImages[objIndex].meter.value=100
                dataPrepared.previewImages[objIndex].meter.display=false
                clearInterval(interval)
                console.log(obj)
                //resolveRoot()
                
              }
              if(objIndex==dataPrepared.images.length-1){
                return true
              }
            })
          }
          if(dataPrepared.images.length==0){
            return true
          }
        }
        await promiseRoot().then(async (response) => {
          console.log(response)
          data.status.loading = false
          delete dataPrepared.previewImages
          delete dataPrepared.status
          delete dataPrepared.refs
          response = await $fetch('/api/suppliers/create', {
            method: "POST",
            body: JSON.stringify(dataPrepared)
          })
          if (response.length > 0) {
            notificationStore.showNotification({ type: 'success', title: `${response[0].name} <span class="text-${props.data ? 'blue' : 'green'}-500 font-bold">${props.data ? 'updated' : 'created'}</span> success` })
            forms.value.data.splice(index,1)
            console.log(index,formsClone.length,forms.value.data.length)
            if (index == formsClone.length - 1) {
              forms.value.data = []
              emits('doing', false)
              if (forms.value.data.length < 1) {
                insertForm()
              }
            }
          }
        })
      }
      if (!isValid.success) {
        console.log(isValid.success)
        if (firstPoint == null) {
          firstPoint = index
          elements.value[index1].scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        const errors = []
        JSON.parse(isValid.error).forEach(err => {
          errors.push({ path: err.path[0], message: err.message })
        })
        data.refs.form.setErrors(errors)
      }
      if (existedName) {

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