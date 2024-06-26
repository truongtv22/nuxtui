<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const history = useMyHistoryStore()
const props = defineProps(['display'])
const emits = defineEmits(['display', 'showProductList'])
const isOpen = computed({
  get() {
    return props.display
  },
  set(df = false) {
    emits('display', df)
  }
})
const sizeScreen = ref({
  w: null,
  h: null
})
function onResize() {
  sizeScreen.value.w = window.innerWidth
  sizeScreen.value.h = window.innerHeight
}
onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
const schema = z.object({
  name: z.object({}),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }
  ).min(1)
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
const productList = ref({
  display: false
})
const loading = ref(false)
const selected = ref()

async function search(q: string) {
  loading.value = true

  const users = await $fetch<any[]>('https://jsonplaceholder.typicode.com/users', { params: { q } })

  loading.value = false

  return users
}
const productInfo = ref({
  name: null,
  price: null,
  barcode: null,
  selected:[]
})
const itemSelected=computed({
  get(){
    return productInfo.value.selected.length
  }
})
watch(itemSelected,(newVal,oldVal)=>{
  if(parseInt(newVal)>1){
    productInfo.value.selected.splice(0,1)
    
  }
  productInfo.value.name=productInfo.value.selected[0]
})
const nameSelected = computed({
  get() {
    return productInfo.value.name
  }
})
watch(nameSelected, (newVal, oldVal) => {
  let iss = false
  history.search.forEach(it => {
    if (it.id == newVal.id) {
      iss = true
    }
  })
  if (!iss) {
    history.insertSearch(newVal)
  }
})
const columns = [{
  key: 'id',
  label: 'ID'
}, {
  key: 'name',
  label: 'Name'
}, {
  key: 'title',
  label: 'Title'
}, {
  key: 'email',
  label: 'Email'
}, {
  key: 'role',
  label: 'Role'
}]

const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}]

const q = ref('')

const filteredRows = computed(() => {
  if (!q.value) {
    return people
  }

  return people.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
</script>

<template>
  <div>
    <UModal v-if="isOpen" :ui="{ width: `sm:max-w-6xl` }" v-model="isOpen" :fullscreen="sizeScreen.w < 800 ? true : false"
      :prevent-close="!productList.display">

      <UCard :ui="{
        base: 'h-fit flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow'
        }
      }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Insert new product to warehouse {{ sizeScreen.w }}{{productInfo.name}}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>

        <UForm :schema="schema" :state="productInfo" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Tên sản phẩm" name="name">
            <UButton size="xl" variant="outline" class="w-full justify-center flex" @click="productList.display = true">
              <template v-if="productInfo.selected.length>0">{{ productInfo.selected[0].name }}</template>
              <UIcon v-else name="i-material-symbols-light-add" />
            </UButton>


          </UFormGroup>
          <UFormGroup label="Barcode" name="barcode">
            <UInput v-model="productInfo.barcode" />
          </UFormGroup>
          <UFormGroup label="Giá nhập" name="price">
            <UInput v-model="productInfo.price" />
          </UFormGroup>
          <UFormGroup label="Giá bán" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Số lượng" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Đơn vị" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Nhà cung cấp" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Ngày sản xuất" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Thời hạn sử dụng" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Đơn vị" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Ngày hết hạn" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Lãi suất" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Doanh thu tổng" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Tổng chi" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Lãi thực tổng" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Ghi chú" name="price">
            <UInput v-model="state.email" />
          </UFormGroup>

          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </UCard>
    </UModal>
    <USlideover v-if="productList.display" v-model="productList.display" side="bottom" @close="isOpen = true"
      :ui="{ wrapper: 'w-full sm:w-1/2 left-25 sm:inset-x-1/4 sm:inset-y-1/4 h-full sm:h-3/5', height: 'max-h-screen h-full sm:h-4/5 overflow' }">
      <div class="p-4 flex-1 h-full">
        <h1 class="mb-4 font-bold">Product list</h1>
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput icon="i-heroicons-magnifying-glass-20-solid" :trailing="q.length>0?true:false" v-model="q" placeholder="Filter people..."  class="w-full" :ui="{ icon: { trailing: { pointer: '' } } }">
        <template #trailing v-if="q.length>0">
          <UButton variant="ghost" @click="q=''" color="red" :ui="{rounded:'rounded-full'}">
            <UIcon name="i-material-symbols-light-close" />
          </UButton>
          
        </template>
      </UInput>
    </div>

    <UTable v-model="productInfo.selected" :rows="filteredRows" :columns="columns" class="h-full sm:h-3/4 overflow-auto" :ui="{thead:'sticky top-0 backdrop-blur-3xl drop-shadow z-50',divide:'divide-y-0'}"/>
      </div>
    </USlideover>

  </div>
</template>
