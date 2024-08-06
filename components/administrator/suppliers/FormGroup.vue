<template>
  <UForm :schema="schema" class="space-y-4 relative w-full">
    <!----------------------------start create new form------------------------------>
    <template v-for="itemRoot, indexRoot in forms" :key="indexRoot">
      <div v-if="itemRoot"
        :class="`w-full ${forms.length > 1 ? 'border' : ''} px-1 rounded-md border-gray-400 py-4 relative`"
        :ref="skipUnwrap.elements">
        <UBadge class="absolute -top-3 -left-3" v-if="forms.length > 1">#{{ indexRoot + 1 }}</UBadge>
        <UButton v-if="forms.length > 1" @click="forms.splice(indexRoot, 1)" color="red"
          class="absolute -top-3 -right-3" :ui="{ rounded: 'rounded-full' }" icon="i-material-symbols-light-close-small"
          square size="2xs"></UButton>
        <AdministratorSuppliersForm :state="itemRoot" @status="response = $event"
          :submit="test == itemRoot ? true : null" :errors="itemRoot.errors" @submit="onSubmit()"/>


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
      <UButton color="red" variant="ghost" :loading="formProcessing" :disabled="formProcessing"
        @click="emits('cancel')">
        Cancel</UButton>
    </div>
    <div v-if="formProcessing" class="w-full absolute top-0 left-0 z-50 h-full cursor-wait"></div>
  </UForm>
</template>

<script lang="ts" setup>
import { z } from 'zod'
const props = defineProps(['data']),
  emits = defineEmits(['doing', 'cancel','update']),
  notificationStore = useMyNotificationsStore()

onBeforeMount(() => {
  insertForm()
  if (props.data) {
    oldData.value = {}
    Object.keys(props.data).forEach(key => {
      forms.value[0][key] = props.data[key]
      oldData.value[key] = props.data[key]
      if(key=='contacts' && props.data.contacts.length==0){
        oldData.value.contacts.push({address:null,phone:null})
      }
    })
  }
})
const forms = ref([]),
  oldData = ref(null),
  elements = ref([]),
  test = ref(null),
  schema = z.object({
    name: z.string({
      required_error: "Tên nha cung cap không để trống",
      invalid_type_error: "Tên nha cung cap không để trống",
    }).min(6, { message: 'Tên nha cung cap có độ dài ít nhất 6 ký tự' }),
    email: z.string().email().optional().or(z.literal(''))
  })
const skipUnwrap = { elements }
const formProcessing = computed(() => {
  return forms.value.filter(item => item.status.loading).length > 0
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
    errors: []
  })
}
const response = ref(null)
async function onSubmit() {
  for await (const form of forms.value) {
    emits('doing', true)
    const index = forms.value.indexOf(form)
    skipUnwrap.elements.value[index].scrollIntoView({ behavior: 'smooth', block: 'start' })
    console.log(form)
    form.status.loading = true
    form.errors = []
    const validate = await schema.safeParse(form)
    let nameValid = true
    if ((oldData.value && oldData.value.name != form.name) || !oldData.value) {
      nameValid = await $fetch('/api/suppliers/get?' + new URLSearchParams({ name: form.name })).then(response => {
        return response.length < 1
      })
    }

    await Promise.all([validate, nameValid]).then(async ([validate, nameValid]) => {
      if (!validate.success) {
        JSON.parse(validate.error).forEach(err => {
          form.errors.push({ path: err.path[0], message: err.message })
        })
      }
      if (!nameValid) {
        form.errors.push({ path: 'name', message: 'Supplier is existed' })
      }
      if (validate.success && nameValid) {
        const imageUrls = []
        const promise = async () => {
          for await (const obj of form.previewImages) {
            if (Object.hasOwn(obj, 'file')) {
              const temp = {}
              const objIndex = form.previewImages.indexOf(obj)
              form.previewImages[objIndex].meter.display = true
              const interval = setInterval(() => {
                if (form.previewImages[objIndex].meter.value < 100) {
                  form.previewImages[objIndex].meter.value += 1
                }
                if (form.previewImages[objIndex].meter.value == 100) {
                  clearInterval(interval)
                }
              }, 100)
              await uploadFile(obj.file).then(async (res) => {
                if (res.status == 'success') {
                  temp.original = res.data.original
                  return await uploadFile(obj.file, 300)
                }
              }).then(async (res) => {
                if (res?.status == 'success') {
                  temp.medium = res.data.original
                  return await uploadFile(obj.file, 100)
                }
              }).then(res => {
                if (res?.status == 'success') {
                  temp.small = res.data.original
                  form.previewImages[objIndex].meter.value = 100
                  form.previewImages[objIndex].meter.display = false
                  delete obj.file
                  imageUrls.push(temp)
                  clearInterval(interval)
                }
              })
            }
          }
        }
        await promise().then(async () => {
          const dataPrepared = {}
          Object.keys(form).forEach(key => {
            if (!['previewImages', 'refs', 'status'].includes(key)) {
              dataPrepared[key] = form[key]
            }
          })
          dataPrepared.images = dataPrepared.images.concat(imageUrls)
          dataPrepared.created_at = new Date()
          dataPrepared.contacts = dataPrepared.contacts.filter(item => item.address || item.phone)
          await $fetch(`/api/suppliers/${oldData.value ? 'update' : 'create'}`, {
            method: oldData.value ? 'PUT' : 'POST',
            body: JSON.stringify(dataPrepared)
          }).then(rs => {
            if (rs.length > 0 || rs.modifiedCount==1) {
              notificationStore.showNotification({
                title: `Supplier: <strong>${form.name}</strong> <span class="text-${props.data ? 'blue' : 'green'}-500">${props.data ? 'updated' : 'created'}</span> success`,
                type: 'success'
              })
              if (!oldData.value) {
                emits('newData', rs[0])
              }
              else{
                emits('update',dataPrepared)
              }
            }
          })
          if (!oldData.value) {
            forms.value = forms.value.filter(item => item != form)
          }

        })
      }
      if (forms.value.length < 1) {
        insertForm()
      }
      form.status.loading = false
      emits('doing', false)
      setTimeout(() => {
        skipUnwrap.elements.value[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 1)

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