<template>
  <div class="min-h-full flex flex-col">
    {{ pageCount }}
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
    <div class="flex gap-1">
      <UButton class="capitalize" :ui="{ rounded: 'rounded-full' }" @click="showForm()">
        <UIcon class="font-bold text-xl" name="i-material-symbols-light-add" />Create new supplier
      </UButton>
      <Transition>
        <UChip class="transition-all" v-if="table.selected.length > 0" :text="table.selected.length" size="xl"
          color="red">
          <UButton :loading="loading.delete" color="red" :ui="{ rounded: 'rounded-full' }"
            @click="modals.confirm.display = true, modals.confirm.title = `Do you sure want delete ${table.selected.length} item${table.selected.length > 1 ? 's' : ''}?`, modals.confirm.input = 'delete'">
            <UIcon class="font-bold text-xl" name="i-material-symbols-light-delete" />Delete
          </UButton>
        </UChip>
      </Transition>
      <TransitionGroup>
        <UDivider v-if="table.selected.length >= pageCount" label="or" type="dotted" />
        <UChip v-if="table.selected.length >= pageCount" class="transition-all" :text="table.data.length" size="xl"
          color="red">
          <UButton :loading="loading.delete" :disabled="loading.delete" color="red" :ui="{ rounded: 'rounded-full' }"
            @click="modals.confirmDeleteAll.display = true, loading.delete = true">
            <UIcon class="font-bold text-xl" name="i-material-symbols-light-delete" />Delete all records
          </UButton>
        </UChip>
      </TransitionGroup>


    </div>
    <UInput v-model="table.keyword" placeholder="Filter people..." />
  </div>
  <div ref="tableEl">
    <UTable :rows="filteredRows" :columns="table.columns" v-model="table.selected" :loading="table.loading">
      <template #actions-data="{ row }">
        <UButton @click="showForm(row)" color="blue" icon="i-material-symbols-light-info-outline-rounded"
          variant="ghost" :ui="{ rounded: 'rounded-full' }" />
      </template>
      <template #edited_at-data="{ row }">
        <UBadge size="md" variant="soft" color="blue" v-if="row.edited_at">
          {{ reformatDate(row.edited_at) }}
        </UBadge>
        <span class="capitalize" v-else>
          No data
        </span>
      </template>
      <template #created_at-data="{ row }">
        <UBadge size="md" variant="soft" color="blue" v-if="row.created_at">
          {{ reformatDate(row.created_at) }}
        </UBadge>
        <span class="capitalize" v-else>
          No data
        </span>
      </template>
      <template #contacts-data="{ row }">
        <div v-if="row.contacts.filter(item=>item.address || item.phone).length>0">
          <div v-if="row.contacts[0].address" class="text-blue-500 items-center flex w-28">
            <UIcon name="i-material-symbols-light-location-on-rounded" />
            <span class="w-full truncate">{{ row.contacts[0].address }}</span>
          </div>
          <div v-if="row.contacts[0].phone" class="text-yellow-500 items-center flex w-28">
            <UIcon name="i-material-symbols-light-phone-iphone-sharp" />
            <span class="w-full truncate">{{ row.contacts[0].phone }}</span>
          </div>
        </div>
        <template v-else>No Data</template>
      </template>
      <template #name-data="{row}">
        <div @dblclick="router.push('suppliers/detail-' + row._id)">{{ row.name }}</div>
      </template>
    </UTable>
  </div>

  <UDivider class="mb-2" />
  <div class="flex justify-center mt-auto mb-2 w-full">
    <UPagination v-model="table.page" :page-count="pageCount" :total="table.data.length" />
  </div>
  <UModal :ui="{ width: `sm:max-w-6xl`, overlay: { background: 'backdrop-blur-md' } }" v-model="modals.form.display"
    :fullscreen="basicStore.screenSize.w < 800 ? true : false" prevent-close>
    <UCard :ui="{
      base: 'h-fit flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'grow'
      },
      header: {
        base: `bg-${modals.form.data ? 'blue' : 'green'}-500 relative`
      }
    }" class="relative">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="capitalize text-base font-semibold leading-6 text-white dark:text-white">
            {{ modals.form.data ? modals.form.data.name : 'tạo mới nha cung cap' }}
          </h3>
          <UButton :disabled="loading.create" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click=" modals.confirm.display = true, modals.confirm.title = 'Bạn có chắc muốn đóng cửa sổ này?', modals.confirm.input = 'form'" />
        </div>
        <div class="bottom-0 absolute w-full right-0" v-if="loading.create">
          <UProgress size="xs" animation="carousel" :ui="{ progress: { rounded: 'rounded-none' } }" />
        </div>
      </template>
      <AdministratorSuppliersFormGroup v-if="modals.form.display" :data="modals.form.data"
        @update="table.data = table.data.map(item => item._id == $event._id ? $event : item)"
        @new-data="table.data.unshift($event)" @doing="loading.create = $event"
        @cancel=" modals.confirm.display = true, modals.confirm.title = 'Bạn có chắc muốn đóng cửa sổ này?', modals.confirm.input = 'form'" />
    </UCard>
  </UModal>
  <ConfirmModal v-model="modals.confirm.display" :title="modals.confirm.title" :input="modals.confirm.input"
    @is-confirmed="isConfirmed($event)" />
  </div>
  
</template>

<script lang="ts" setup>

const router = useRouter(),
  route = useRoute()
const basicStore = useMyBasicStore(),
  notificationStore = useMyNotificationsStore()
const modals = ref({
  form: {
    display: false,
    data: null
  },
  confirm: {
    display: false,
    title: null,
    input: null
  },
  confirmDelete: {
    display: false,
    title: 'Do you sure delete item?'
  },
  confirmClose: {
    display: false,
    title: 'Do you sure close this window?'
  },
  confirmDeleteAll: {
    display: false,
    title: 'Do you sure delete all items?'
  },
  updateForm: {
    data: null
  }
})
const loading = ref({
  delete: false,
  create: false
})
const tableEl = ref(null)
const table = ref({
  columns: [
    { key: '_id', label: 'ID' },
    { key: 'name', label: 'name' },
    { key: 'contacts', label: 'Contacts' },
    //{key:'description',label:'Description'},
    //{key:'note',label:'Note'},
    //{key:'tags',label:'Tags'},
    { key: 'created_at', label: 'Created at' },
    { key: 'created_by', label: 'Created by' },
    { key: 'edited_at', label: 'Edited at' },
    { key: 'edited_by', label: 'Edited by' },
    { key: 'actions' }
  ],
  selected: [],
  keyword: null,
  data: [],
  page: 1,
  pageCount: 10,
  loading: false
})

const pageCount = computed(() => {
  if (tableEl.value && table.value.data.length>0) {
    setTimeout(()=>{
      console.log(tableEl.value.offsetHeight)
      return Math.floor((basicStore.screenSize.h - tableEl.value.offsetTop - 32 - 68.5) / (tableEl.value.offsetHeight/10))
    },1)
    return 10
    
  }
  else{
    console.log(1111221)
    return 10
  }
  
  //return Math.floor((basicStore.screenSize.h - 84 - 61 - 48.5 - 32) / 65)

})
function reformatDate(val) {
  return new Date(Date.parse(val))
}
onMounted(async () => {
  table.value.loading = true
  await $fetch('/api/suppliers/list').then(res => {
    if (res.length > 0) {
      table.value.data = res.sort((item1, item2) => item1.created_at < item2.created_at)
    }
    table.value.loading = false
  })
})
const filteredRows = computed(() => {
  if (!table.value.keyword) {
    console.log(pageCount.value)
    return table.value.data.slice((table.value.page - 1) * pageCount.value, (table.value.page) * pageCount.value)
  }

  return table.value.data.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(table.value.keyword.toLowerCase())
    })
  })
})
async function deleteSelected(type = null) {
  loading.value.delete = true
  const prom = new Promise(async (resolve1, reject1) => {
    if (type == 'all') {
      table.value.selected = table.value.data
    }
    const arr = Array.from(Array(table.value.selected.length).keys())
    for await (const index of arr) {
      const item = table.value.selected[0]
      await $fetch('/api/suppliers/delete', {
        method: 'DELETE',
        body: {
          _id: item._id
        }
      }).then(res => {
        if (Object.hasOwn(res, 'deletedCount') && res.deletedCount == 1) {
          const promise = new Promise((resolve, reject) => {
            resolve(table.value.data.findIndex(r => r._id == item._id))
          })
          promise.then(rs => {
            table.value.data = table.value.data.filter(item1 => item._id != item1._id)
            table.value.selected = table.value.selected.filter(item1 => item1._id != item._id)
            notificationStore.showNotification({
              title: `${item._id} deleted success`,
              description: `with name: <span class="text-red-500 font-bold text-xl">${item.name}</span>`,
              type: 'success'
            })
          })
        }
        if (index == arr.length - 1) {
          resolve1()
        }
      })
    }
  })
  prom.then(res => {
    loading.value.delete = false
  })
}

function showForm(data = null) {
  modals.value.form.display = true
  modals.value.form.data = data
  window.history.pushState({}, null, route.fullPath + (data ? '/detail-' + data._id : '/create'))
  useSeoMeta({
    title: data ? `${data.name}- Editing supplier` : 'Create new supplier'
  })
}
async function isConfirmed(data) {
  if (data.value) {
    switch (data.input) {
      case 'form':
        modals.value.form.display = false
        modals.value.form.data = null
        window.history.pushState({}, null, route.fullPath)
        break
      case 'delete':
        modals.value.form.display = false
        await deleteSelected()
        break
    }
  }

}
</script>

<style></style>