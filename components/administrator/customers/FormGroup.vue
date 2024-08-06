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
        <AdministratorCustomersForm :state="itemRoot" @status="response = $event"
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
      if(['banner','avatar'].includes(key)){
        forms.value[0][key+'_old']=props.data[key]
      }
    })
  }
})
const forms = ref([]),
  oldData = ref(null),
  elements = ref([]),
  test = ref(null),
  schema = z.object({
    first_name: z.string({
      required_error: "Fist name không để trống",
      invalid_type_error: "Fist name cung cap không để trống",
    }),
    last_name: z.string({
      required_error: "Last name không để trống",
      invalid_type_error: "Last namecung cap không để trống",
    }),
    email: z.string().email().optional().or(z.literal(''))
  })
const skipUnwrap = { elements }
const formProcessing = computed(() => {
  return forms.value.filter(item => item.status.loading).length > 0
})
function insertForm() {
  forms.value.push({
    account:{
      username:null,
      password:null,
      type:null,
      status_active:false
    },
    first_name: null,
    middle_name:null,
    last_name:null,
    email: '',
    contacts: [{
      email: null,
      phone_number: null
    }],
    info:[{
      address:null,
      district:null,
      province:null,
      country:null,
      zip_code:null
    }],
    created_at: null,
    created_by: null,
    edited_at: null,
    edited_by: null,
    description: null,
    note: null,
    tags: null,
    avatar: {
      file:null,
      preview:null,
      refs:null
    },
    banner:{
      file:null,
      preview:null,
      refs:null
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
    form.status.loading = true
    form.errors = []
    const validate = await schema.safeParse(form)
    let nameValid = true
    if ((oldData.value && oldData.value.account.username != form.account.username) || !oldData.value && form.account.username) {
      nameValid = await $fetch('/api/customers/get?' + new URLSearchParams({ username: form.account.username })).then(response => {
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
        form.errors.push({ path: 'account.username', message: 'Username is existed' })
      }
      if (validate.success && nameValid) {
        const avatarUrls = {},
        bannerUrls={}
        const promise = async () => {
            if (form.avatar.preview) {
              const temp = {}
              form.avatar.preview.meter.display = true
              const interval = setInterval(() => {
                if (form.avatar.preview.meter.value < 100) {
                  form.avatar.preview.meter.value += 1
                }
                if (form.avatar.preview.meter.value == 100) {
                  clearInterval(interval)
                }
              }, 100)
              await uploadFile(form.avatar.preview.file).then(async (res) => {
                if (res.status == 'success') {
                  avatarUrls.original = res.data.original
                  return await uploadFile(form.avatar.preview.file, 300)
                }
              }).then(async (res) => {
                if (res?.status == 'success') {
                  avatarUrls.medium = res.data.original
                  return await uploadFile(form.avatar.preview.file, 100)
                }
              }).then(res => {
                if (res?.status == 'success') {
                  avatarUrls.small = res.data.original
                  form.avatar.preview.meter.value = 100
                  form.avatar.preview.meter.display = false
                  clearInterval(interval)
                }
              })
            }
            if (form.banner.preview) {
              form.banner.preview.meter.display = true
              const interval = setInterval(() => {
                if (form.banner.preview.meter.value < 100) {
                  form.banner.preview.meter.value += 1
                }
                if (form.banner.preview.meter.value == 100) {
                  clearInterval(interval)
                }
              }, 100)
              await uploadFile(form.banner.preview.file).then(async (res) => {
                if (res.status == 'success') {
                  bannerUrls.original = res.data.original
                  return await uploadFile(form.banner.preview.file, 300)
                }
              }).then(async (res) => {
                if (res?.status == 'success') {
                  bannerUrls.medium = res.data.original
                  return await uploadFile(form.banner.preview.file, 100)
                }
              }).then(res => {
                if (res?.status == 'success') {
                  bannerUrls.small = res.data.original
                  form.banner.preview.meter.value = 100
                  form.banner.preview.meter.display = false
                  clearInterval(interval)
                }
              })
            }
        }
        await promise().then(async () => {
          const dataPrepared = {}
          Object.keys(form).forEach(key => {
            if (!['status','error','previewImages'].includes(key)) {
              dataPrepared[key] = form[key]
            }
          })
          if(Object.keys(avatarUrls).length>0){
            dataPrepared.avatar = avatarUrls
          }
          if(Object.keys(bannerUrls).length>0){
            dataPrepared.banner = bannerUrls
          }
          
          dataPrepared.created_at = new Date()
          dataPrepared.contacts = dataPrepared.contacts.filter(item => item.email || item.phone)
          dataPrepared.info = dataPrepared.info.filter(item => item.address || item.province || item.district || item.country)
          await $fetch(`/api/customers/${oldData.value ? 'update' : 'create'}`, {
            method: oldData.value ? 'PUT' : 'POST',
            body: JSON.stringify(dataPrepared)
          }).then(rs => {
            if (rs.length > 0 || rs.modifiedCount==1) {
              notificationStore.showNotification({
                title: `Supplier: <strong>${form.first_name} ${form.middle_name} ${form.last_name}</strong> <span class="text-${props.data ? 'blue' : 'green'}-500">${props.data ? 'updated' : 'created'}</span> success`,
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