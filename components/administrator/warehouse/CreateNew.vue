<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import SideOver from './SideOver.vue';
import { format, getDate, getTime, setDate } from 'date-fns'

const router=useRouter()
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
  price1:z.preprocess((val) => Number(val), z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }
  ).min(1,{ message: "Price is required"})),
  price2:z.preprocess((val) => Number(val), z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }
  ).min(1,{ message: "Price is required"})),
  quantity: z.preprocess((val) => Number(val), z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number",
  }).min(1,{ message: "Quantity is required"})),
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
  quantity:null,
  price1:null,
  price2:null,
  laiSuat:null,
  tongDoanhThu:null,
  tongLoiNhuan:null,
  tongChi:null,
  unit:null,
  time1:{value:null},
  time2:{value:null},
  supplier:{
    display:false,
    value:[]
  },
  units:{
    time:{
      value:null,
      items:[
        { label:'Day',value:'day'},
        {label:'week',value:'week'},
        {label:'Month',value:'month'},
        {label:'Year',value:'year'}
      ]
    },
    quantity:{
      value:null,
      items:[
        {label:'Goi',value:'goi'},
        {label:'Day',value:'day'},
        {label:'Cay',value:'cay'},
        {label:'Thung',value:'thung'}
      ]
    }
  },
  date1:{
    value:new Date(),
    locale:null
  },
  date2:{
    value:new Date(),
    locale:null
  },
  selected: []
})
const itemSelected = computed({
  get() {
    return productInfo.value.selected.length
  }
})
watch(itemSelected, (newVal, oldVal) => {
  if (parseInt(newVal) > 1) {
    productInfo.value.selected.splice(0, 1)

  }
  productInfo.value.name = productInfo.value.selected[0]
})
const supplierSelected = computed({
  get() {
    return productInfo.value.supplier.value.length
  }
})
watch(supplierSelected, (newVal, oldVal) => {
  if (parseInt(newVal) > 1) {
    productInfo.value.supplier.value.splice(0, 1)

  }
  let iss = false
  history.search.suppliers.forEach(it => {
    if (it.id == productInfo.value.supplier.value[0].id) {
      iss = true
    }
  })
  if (!iss) {
    history.insertSearch('suppliers',productInfo.value.supplier.value[0])
  }
})
const nameSelected = computed({
  get() {
    return productInfo.value.name
  }
})
watch(nameSelected, (newVal, oldVal) => {
  let iss = false
  history.search.products.forEach(it => {
    if (it.id == newVal.id) {
      iss = true
    }
  })
  if (!iss) {
    history.insertSearch('products',newVal)
  }
})
const date1Selected=computed({
  get(){
    return productInfo.value.date1.value
  }
})

const price1=computed({
  get(){
    if(productInfo.value.price1){
  

      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })
      return formatter.format(productInfo.value.price1)
    }
    return productInfo.value.price1
  }
})
const reformatDate2=computed({
  get(){
    let x=0
    switch(productInfo.value.units.time.value){
    case 'day':
      x=1
      break
    case 'week':
      x=7
      break
    case 'month':
      x=30
      break
    case 'year':
      x=365
      break
  }
    if(productInfo.value.time1.value>0){
      let t=new Date()
      return new Date(productInfo.value.date1.value.valueOf()+1000*60 * 60 * 24*x*productInfo.value.time1.value)
    }
    return productInfo.value.date2.value
  },
  set(val){
    let x=0
  switch(productInfo.value.units.time.value){
    case 'day':
      x=1
      break
    case 'week':
      x=7
      break
    case 'month':
      x=30
      break
    case 'year':
      x=365
      break
  }
  if(productInfo.value.time1.value>0){
    productInfo.value.date1.value=new Date(val.valueOf()-1000*60 * 60 * 24*x*productInfo.value.time1.value)
  }
  }
})
const laiSuatComputed=computed({
  get(){
    if(productInfo.value.price2 && productInfo.value.price1){
      return Math.ceil((productInfo.value.price2-productInfo.value.price1)*100/productInfo.value.price1)
    }
    return null
  },
  set(val){
    if(productInfo.value.price1){
      productInfo.value.price2=parseInt(productInfo.value.price1)+parseInt(Math.floor(val*productInfo.value.price1/100))
    }
  }
})
const tongDoanhThuComputed=computed({
  get(){
    return productInfo.value.price2*productInfo.value.quantity
  }
})
const tongChiComputed=computed({
  get(){
    return productInfo.value.price1*productInfo.value.quantity
  }
})
const tongLoiNhuanComputed=computed({
  get(){
    if(tongDoanhThuComputed.value && tongChiComputed.value){
      const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })
    return formatter.format(tongDoanhThuComputed.value-tongChiComputed.value)
    }
    return null
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
const units=ref([])
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
const masks = ref({
  modelValue: 'DD/MM/YYYY',
});
function updateDate1(e){
  e=(e.target.value)
  if(e.split('/')[2].length==4 && 12>=e.split('/')[1]-1>=1 && 31>=e.split('/')[0]>=1){
    productInfo.value.date1.value=new Date(e.split('/')[2],e.split('/')[1]-1,e.split('/')[0])
  }
  
}
function updateDate2(e){
  e=(e.target.value)
  if(e.split('/')[2].length==4 && 12>=e.split('/')[1]-1>=1 && 31>=e.split('/')[0]>=1){
    productInfo.value.date2.value=new Date(e.split('/')[2],e.split('/')[1]-1,e.split('/')[0])
  }
  
}
function test(e){
  console.log(e.target.value)
  productInfo.value.price1=e.target.value
}

</script>

<template>
  <div>
    <UModal :ui="{ width: `sm:max-w-6xl` }" v-model="isOpen"
      :fullscreen="sizeScreen.w < 800 ? true : false" :prevent-close="!productList.display">
      {{ productInfo.price1 }}
      <UCard :ui="{
        base: 'h-fit flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow'
        }}">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Insert new product to warehouse {{ sizeScreen.w }}{{ productInfo.name }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="emits('display',false)" />
          </div>
        </template>

        <UForm :schema="schema" :state="productInfo" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Tên sản phẩm" name="name">
            <div v-if="productInfo.selected.length > 0" class="w-full flex-col justify-center flex gap-y-1 border p-2 rounded-md">
              <h1 class="text-center border border-dotted border-gray-800 rounded-md p-2" @dblclick="router.push('/')">{{ productInfo.selected[0].name }}</h1>
              <UButton size="xl" variant="soft" class="w-full justify-center flex" @click="productList.display = true;isOpen=false">
                <UIcon name="i-material-symbols-light-add" />
              </UButton>
            </div>
            <UButton v-else size="xl" variant="outline" class="w-full justify-center flex" @click="productList.display = true;isOpen=false">
              <UIcon  name="i-material-symbols-light-add" />
            </UButton>


          </UFormGroup>
          <UFormGroup label="Barcode" name="barcode">
            <UInput v-model="productInfo.barcode" />
          </UFormGroup>
          <UFormGroup label="Giá nhập" name="price1">
            <UInput
        v-model.number="productInfo.price1">
        <template #trailing>
      <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
    </template>
      </UInput>
          </UFormGroup>
          <UFormGroup label="Giá bán" name="price2">
            <UInput v-model.number="productInfo.price2">
              <template #trailing>
      <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
    </template>
            </UInput>
          </UFormGroup>
          <UFormGroup label="Số lượng" name="quantity">
            <UInput v-model.number="productInfo.quantity" />
          </UFormGroup>
          <UFormGroup label="Đơn vị" name="price">
            <USelectMenu
    searchable
    searchable-placeholder="Search a person..."
    class="w-full"
    placeholder="Select a person"
    :options="units"
    v-model="productInfo.unit"
  >
  <template #option-empty="{ query }">
      <UButton icon="i-material-symbols-light-add" @click="units.push(query);productInfo.unit=query">Create new {{ query }}</UButton>
    </template>
</USelectMenu>
          </UFormGroup>
          <UFormGroup label="Nhà cung cấp" name="price">
            <div v-if="productInfo.supplier.value.length > 0" class="w-full flex-col justify-center flex gap-y-1 border p-2 rounded-md">
              <h1 class="text-center border border-dotted border-gray-800 rounded-md p-2" @dblclick="router.push('/')">{{ productInfo.supplier.value[0].name }}</h1>
              <UButton size="xl" variant="soft" class="w-full justify-center flex" @click="productInfo.supplier.display = true;isOpen=false">
                <UIcon name="i-material-symbols-light-add" />
              </UButton>
            </div>
            <UButton v-else size="xl" variant="outline" class="w-full justify-center flex" @click="productInfo.supplier.display = true;isOpen=false">
              <UIcon  name="i-material-symbols-light-add" />
            </UButton>
          </UFormGroup>
          
          
          <div class="grid grid-cols-4 gap-1">
            <UFormGroup label="Ngày sản xuất" name="price">
              <VDatePicker v-model="productInfo.date1.value" >
    <template v-slot="{ inputValue, inputEvents,togglePopover }">
      <UInput :model-value="format(productInfo.date1.value,'dd/MM/yyyy')" @click="togglePopover" @keyup="updateDate1($event)" />
    </template>
  </VDatePicker>
          </UFormGroup>
            <UFormGroup label="Thời hạn sử dụng" name="time1">
            <UInput v-model="productInfo.time1.value" />
          </UFormGroup>
          <UFormGroup label="Đơn vị" name="timeUnit">
            <USelectMenu
    :searchable="productInfo.units.time.items.length>10?true:false"
    searchable-placeholder="Search a person..."
    class="w-full"
    placeholder="Select a person"
    :options="productInfo.units.time.items" value-attribute="value" option-attribute="label" v-model="productInfo.units.time.value"
  >
  <template #label>
    <span class="capitalize text-red-500" v-if="productInfo.units.time.value">{{ productInfo.time1.value&&productInfo.time1.value>1?productInfo.units.time.value+'s':productInfo.units.time.value }}</span>
    <span v-else>Select people</span>
  </template>
<template #option="{option:item}"><span class="capitalize">{{ productInfo.time1.value&&productInfo.time1.value>1?item.label+'s':item.label }}</span></template>
</USelectMenu>

          </UFormGroup>
          <UFormGroup label="Ngày hết hạn" name="time2">
            <VDatePicker v-model="reformatDate2" >
    <template v-slot="{ inputValue, inputEvents,togglePopover }">
      <UInput :model-value="format(reformatDate2,'dd/MM/yyyy')" @click="togglePopover" @keyup="updateDate2($event)" />
    </template>
  </VDatePicker>
          </UFormGroup>
          </div>
          
          
          <UFormGroup label="Lãi suất" name="price">
            <UInput v-model="laiSuatComputed" />
          </UFormGroup>
          <UFormGroup label="Doanh thu tổng" name="price">
            <UInput v-model="tongDoanhThuComputed" />
          </UFormGroup>
          <UFormGroup label="Tổng chi" name="price">
            <UInput v-model="tongChiComputed" />
          </UFormGroup>
          <UFormGroup label="Lãi thực tổng" name="price">
            <UInput v-model="tongLoiNhuanComputed" />
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

  <SideOver v-if="productList.display" :productList="productList" @isOpen="isOpen=$event">
      <template #header>
        <h1 class="font-bold capitalize">product list</h1>
      </template>
      <template #body>
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-col">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" :trailing="q.length > 0 ? true : false" v-model="q"
            placeholder="Filter people..." class="w-full" :ui="{ icon: { trailing: { pointer: '' } } }">
            <template #trailing v-if="q.length > 0">
              <UButton variant="ghost" @click="q = ''" color="red" :ui="{ rounded: 'rounded-full' }">
                <UIcon name="i-material-symbols-light-close" />
              </UButton>

            </template>
          </UInput>
          <div class="gap-1 flex my-2">
            <UButton v-for="old in history.search.products" variant="ghost" :ui="{rounded:'rounded-full'}" @click="productInfo.selected.push(old);productList.display=false;isOpen=true">{{ old.name }}</UButton>
          </div>
          
        </div>

        <UTable v-model="productInfo.selected" :rows="filteredRows" :columns="columns"
          class="overflow-auto overflow-y-auto h-full"
          :ui="{ thead: 'sticky top-0 backdrop-blur-3xl drop-shadow z-50', divide: 'divide-y-0' }">
        <template #name-data="{row}">
          <h1 @dblclick="router.push('/')" @click="productInfo.selected.push(row)">{{ row.name }}</h1>
        </template>
        </UTable>
      </template>
    </SideOver>

    <SideOver v-if="productInfo.supplier.display" :productList="productInfo.supplier" @isOpen="isOpen=$event">
      <template #header>
        <h1 class="font-bold capitalize">Suppliers list</h1>
      </template>
      <template #body>
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-col">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" :trailing="q.length > 0 ? true : false" v-model="q"
            placeholder="Filter people..." class="w-full" :ui="{ icon: { trailing: { pointer: '' } } }">
            <template #trailing v-if="q.length > 0">
              <UButton variant="ghost" @click="q = ''" color="red" :ui="{ rounded: 'rounded-full' }">
                <UIcon name="i-material-symbols-light-close" />
              </UButton>

            </template>
          </UInput>
          <div class="gap-1 flex my-2">
            <UButton v-for="old in history.search.suppliers" variant="ghost" :ui="{rounded:'rounded-full'}" @click="productInfo.supplier.value.push(old);productList.display=false;isOpen=true">{{ old.name }}</UButton>
          </div>
          
        </div>

        <UTable v-model="productInfo.supplier.value" :rows="filteredRows" :columns="columns"
          class="overflow-auto overflow-y-auto h-full"
          :ui="{ thead: 'sticky top-0 backdrop-blur-3xl drop-shadow z-50', divide: 'divide-y-0' }">
        <template #name-data="{row}">
          <h1 @dblclick="router.push('/')" @click="productInfo.supplier.value.push(row)">{{ row.name }}</h1>
        </template>
        </UTable>
      </template>
    </SideOver>
  </div>
</template>
<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>