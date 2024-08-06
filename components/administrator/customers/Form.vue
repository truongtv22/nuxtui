<template>
  <UForm ref="form" :schema="schema" :state="state">
    <div class="grid md:grid-cols-3 grid-cols-1 gap-x-1">
      <UFormGroup label="First Name" name="first_name">
        <UInput ref="names" v-model="state.first_name" @keyup.enter="$event.target.blur(), emits('submit')"
          @blur="state.first_name = $event.target.value.trim()" />
      </UFormGroup>
      <UFormGroup label="Mid Name" name="middle_name">
        <UInput ref="names" placeholder="optional" v-model="state.middle_name"
          @blur="state.middle_name = $event.target.value.trim()" />
      </UFormGroup>
      <UFormGroup label="Last Name" name="last_name">
        <UInput ref="names" v-model="state.last_name" @keyup.enter="$event.target.blur(), emits('submit')"
          @blur="state.last_name = $event.target.value.trim()" />
      </UFormGroup>
    </div>
    <div class="flex flex-row gap-x-1">
      <div class="flex-1 grid grid-cols-3 gap-x-1">
        <UFormGroup label="Username" name="account.username">
          <UInput :disabled="state.account.status" v-model="state.account.username"
            @blur="state.name = $event.target.value.trim()" />
        </UFormGroup>
        <UFormGroup label="Password" name="account.password">
          <UInput :type="display.password ? 'password' : 'text'" :disabled="state.account.status"
            v-model="state.account.password" :ui="{ icon: { trailing: { pointer: '' } } }">
            <template #trailing>
              <UIcon class="cursor-pointer" @click="display.password = !display.password"
                :name="`i-material-symbols-light-visibility${!display.password ? '-off' : ''}-outline-rounded`" />
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup label="Level" name="account.type">
          <UInput :disabled="state.account.status" v-model="state.account.type" />
        </UFormGroup>
      </div>
      <div class="w-20 flex">
        <UFormGroup :ui="{ wrapper: 'flex flex-col', container: 'flex flex-1 items-center' }" label="Status active"
          name="account.status">
          <UToggle v-model="state.account.status" />
        </UFormGroup>
      </div>

    </div>
    <UFormGroup label="Contacts" name="contacts">
      <div class="flex flex-col gap-y-2">
        <div class="w-full flex flex-row gap-x-2" v-for="item, index in state.contacts" :key="'contact' + index">
          <Transition>
            <UButton v-if="item.email || item.phone" class="h-fit" :color="index == 0 ? 'green' : 'red'"
              :icon="index == 0 ? 'i-material-symbols-light-add' : 'i-material-symbols-light-remove-rounded'"
              :variant="index == 0 ? 'soft' : 'ghost'"
              @click="index == 0 ? state.contacts.unshift({ address: null, phone: null }) : state.contacts.splice(index, 1)">
            </UButton>
          </Transition>

          <div class="flex-1 grid md:grid-cols-2 grid-cols-1 gap-x-1">
            <UFormGroup :name="`contacts.${index}.email`">
              <UInput placeholder="Email" v-model="item.email">
                <template #leading>
                  <UIcon name="i-material-symbols-light-mail-rounded"></UIcon>
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup name="phone">
              <UInput placeholder="Phone number" v-model="item.phone_number" class="" @keypress="isLetter($event)">
                <template #leading>
                  <UIcon name="i-material-symbols-light-phone-iphone-sharp"></UIcon>
                </template>
              </UInput>
            </UFormGroup>
          </div>
        </div>
        <div class="w-full flex flex-row gap-x-2" v-for="item, index in state.info" :key="'info' + index">
          <Transition>
            <UButton v-if="item.address || item.district || item.province || item.country || item.zip_code"
              :color="index == 0 ? 'green' : 'red'"
              :icon="index == 0 ? 'i-material-symbols-light-add' : 'i-material-symbols-light-remove-rounded'"
              :variant="index == 0 ? 'soft' : 'ghost'"
              @click="index == 0 ? state.info.unshift({ address: null, district: null, province: null, country: null, zip_code: null }) : state.info.splice(index, 1)">
            </UButton>
          </Transition>

          <div class="flex-1 grid grid-cols-5 gap-x-1">
            <UFormGroup name="address">
              <UInput placeholder="Address" v-model="item.address" class="">
                <template #leading>
                  <UIcon name="i-material-symbols-light-location-on-rounded"></UIcon>
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup name="district">
              <UInput placeholder="District" v-model="item.district" class="">

              </UInput>
            </UFormGroup>
            <UFormGroup name="province">
              <UInput placeholder="Province" v-model="item.province" class="">
              </UInput>
            </UFormGroup>
            <UFormGroup name="country">
              <UInput placeholder="Country" v-model="item.country" class="">
                <template #leading>
                  <UIcon name="i-material-symbols-light-globe"></UIcon>
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup name="zip">
              <UInput placeholder="Zip Code" v-model="item.zip_code" class="">
                <template #leading>
                  <UIcon name="i-material-symbols-light-barcode"></UIcon>
                </template>
              </UInput>
            </UFormGroup>
          </div>
        </div>


      </div>

    </UFormGroup>
    <UFormGroup label="Photos" name="images">
      <div class="flex flex-row w-full gap-x-2">
        <div class="w-32 border border-dotted h-32 rounded-md relative">
          <PreviewImage v-if="Object.hasOwn(state,'avatar_old') && state.avatar_old" :data="state.avatar_old" :width="'full'" :height="'full'"
            @remove="state.avatar_old = null" />
            <template v-else>
              <UIcon class="w-32 h-32" v-if="!state.avatar.preview" name="i-material-symbols-light-account-box-outline"
            @mouseover="display.avatarAction = true" />
          <PreviewImage v-else :data="state.avatar.preview" :width="32" :height="32" @remove="state.avatar.preview = null"
            :loading="state.avatar.preview.meter.value" :status="state.avatar.preview.meter.display" />
          <Transition>
            <div v-if="display.avatarAction" class="absolute top-0 right-0 w-full h-full backdrop-blur-md rounded-md"
              @mouseout="display.avatarAction = false" @click="state.avatar.refs.click()">
              <UIcon class="w-32 h-32" name="i-material-symbols-light-add" />
            </div>
          </Transition>
          <input class="hidden" type="file" :ref="el => state.avatar.refs = el"
            @change="previewSelected($event, state.avatar)" />
            </template>
          
        </div>
        <div class="flex-1 border border-dotted h-32 rounded-md relative justify-center flex w-full"
          @mouseover="display.bannerAction = true">
          <PreviewImage v-if="Object.hasOwn(state,'banner_old') && state.banner_old" :data="state.banner_old" :width="'full'" :height="'full'"
            @remove="state.banner_old = null" />
            <template v-else>
              <UIcon class="w-32 h-32" v-if="!state.banner.preview"
            name="i-material-symbols-light-imagesmode-outline-rounded" />
          <PreviewImage v-else :data="state.banner.preview" :width="'full'" :height="'full'"
            @remove="state.banner.preview = null" :loading="state.banner.preview.meter.value"
            :status="state.banner.preview.meter.display" />
          <Transition>
            <div v-show="display.bannerAction"
              class="absolute flex justify-center top-0 right-0 w-full h-full backdrop-blur-md rounded-md"
               @mouseout.stop="display.bannerAction=false" @click="state.banner.refs.click()">
              <UIcon class="w-32 h-32" name="i-material-symbols-light-add" />
            </div>
          </Transition>
          <input class="hidden" type="file" :ref="el => state.banner.refs = el"
            @change="previewSelected($event, state.banner)" />
            </template>
          
        </div>
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
const emits = defineEmits(['status', 'submit']),
  props = defineProps(['submit', 'state', 'errors'])

const fileAvatar = ref(null)
const display = ref({
  avatarAction: false,
  bannerAction: false,
  password: true
})
const form = ref(),
  schema = z.object({
    first_name: z.string({
      required_error: "First name không để trống",
      invalid_type_error: "First name không để trống",
    }),
    last_name: z.string({
      required_error: "Last name không để trống",
      invalid_type_error: "Last name không để trống",
    }),
    contacts: z.array(z.object({
      email: z.string().email().optional().or(z.literal(''))
    }))
  })

async function previewSelected(e, output) {
  for (let i = 0; i < e.srcElement.files.length; i++) {

    const file = e.srcElement.files[i]
    const resizedBlob = await resizeImage(file, 300),
      resized = URL.createObjectURL(resizedBlob)
    output.preview = {
      original: URL.createObjectURL(file),
      small: resized,
      meter: {
        display: false,
        value: 0
      },
      file
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
}, { deep: true })
function isLetter(e) {
  let char = String.fromCharCode(e.charCode);
  if (!/^[A-Za-z]+$/.test(char)) return true;
  else e.preventDefault();
}

</script>

<style></style>