<template>
  <UForm ref="form" :schema="schema" :state="state">
    <UFormGroup label="Tên nha cung cap" name="name">
      <UInput ref="names" v-model="state.name" @keyup.enter="$event.target.blur(), emits('submit')" @blur="state.name=$event.target.value.trim()"/>
    </UFormGroup>
    <UFormGroup label="Contacts" name="contacts">
      <div class="flex flex-col gap-y-2">
        <UFormGroup name="email">
          <UInput placeholder="Email" v-model="state.email" class="">
            <template #leading>
              <UIcon name="i-material-symbols-light-mail-rounded"></UIcon>
            </template>
          </UInput>
        </UFormGroup>
        <div class="grid grid-cols-1 gap-x-1 relative " v-for="item, index in state.contacts">
          <UDivider :label="`#${index + 1}`" v-if="state.contacts.length > 1" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-1">
            <UInput placeholder="Address" v-model="item.address">
              <template #leading>
                <UIcon name="i-material-symbols-light-location-on-rounded" />
              </template>
            </UInput>
            <UInput placeholder="Phone number" v-model="item.phone" @keypress="isLetter($event)">
              <template #leading>
                <UIcon name="i-material-symbols-light-phone-iphone-sharp" />
              </template>
            </UInput>
          </div>
          <div v-if="state.contacts.length > 1"
            class="absolute top-0 right-0 bg-red-500 flex items-center justify-center rounded-full cursor-pointer"
            @click="state.contacts.splice(index, 1)">
            <UIcon name="i-material-symbols-light-close-small-rounded" class=" text-white" />
          </div>
        </div>
        <UButton class="w-full text-center flex justify-center" variant="soft" label="Add more contact"
          @click="state.contacts.push({ address: null, phone: null })"></UButton>
      </div>

    </UFormGroup>
    <UFormGroup label="Photos" name="images">
      <div
        :class="'min-h-32 w-full border border-dotted border-2 rounded-md ' + (state.previewImages.length < 1 ? ' cursor-pointer' : '')">
        <div v-if="state.previewImages.length == 0 && state.images.length==0" @click="state.refs.file.click()"
          class="w-full min-h-32 justify-center items-center flex">
          <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400" />
        </div>

        <div v-else class="grid grid-cols-1">
          <div class="grid grid-cols-2 sm:grid-cols-4 p-2 gap-2">
            <PreviewImage v-for="data, index in state.images" :data @remove="state.images.splice(index,1)" :key="index"/>
            <PreviewImage v-for="data, index in state.previewImages" :data :index :loading="data.meter.value"
              :status="data.meter.display" @remove="state.previewImages.splice(index, 1)" :key="index"/>
          </div>
          <UDivider />
          <div class="flex justify-center cursor-pointer" @click="state.refs.file.click()">
            <UIcon name="i-material-symbols-light-add-photo-alternate-outline-rounded" class="text-7xl text-gray-400" />
          </div>
        </div>

        <input type="file" class="hidden" accept=".jpg, .jpeg, .png" :ref="el => state.refs.file = el"
          @change="previewSelected($event)" multiple />
      </div>
    </UFormGroup>
    <UFormGroup label="Description" name="description">
      <UTextarea v-model="state.description" rows="6" />
    </UFormGroup>
    <UFormGroup label="Note" name="note">
      <UTextarea v-model="state.note" rows="6" />
    </UFormGroup>
    <UFormGroup label="Tags" name="tags">
      <UTextarea v-model="state.tags" rows="6" disabled />
    </UFormGroup>
  </UForm>
</template>

<script lang="ts" setup>
import { z } from 'zod';
const emits = defineEmits(['status','submit']),
  props = defineProps(['submit','state','errors'])

const form = ref(),
  schema = z.object({
    name: z.string({
      required_error: "Tên nha cung cap không để trống",
      invalid_type_error: "Tên nha cung cap không để trống",
    }).min(6, { message: 'Tên nha cung cap có độ dài ít nhất 6 ký tự' }),
    email:  z.string().email().optional().or(z.literal(''))
  })

async function previewSelected(e) {
  for (let i = 0; i < e.srcElement.files.length; i++) {

    const file = e.srcElement.files[i]
    const resizedBlob = await resizeImage(file, 300),
      resized = URL.createObjectURL(resizedBlob)
    let iss = false
    props.state.previewImages.forEach(item => {
      if (item && item.file.name == file.name) {
        iss = true
      }
    })
    if (!iss) {
      props.state.previewImages.push({
        original: URL.createObjectURL(file),
        small: resized,
        meter: {
          display: false,
          value: 0
        },
        file
      })
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

watch(() => props.errors, (newVal, oldVal) => {
  if (newVal) {
    form.value.setErrors(props.errors)
  }
},{deep:true})
function isLetter(e) {
  let char = String.fromCharCode(e.charCode);
  if(!/^[A-Za-z]+$/.test(char)) return true; 
  else e.preventDefault();
}
</script>

<style></style>