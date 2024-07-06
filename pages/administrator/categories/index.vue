<template>
  <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 relative">
    <div class="flex gap-1">
      <UButton class="capitalize" :ui="{ rounded: 'rounded-full' }" @click="modals.createForm.display = true">
        <UIcon class="font-bold text-xl" name="i-material-symbols-light-add" />Create new category
      </UButton>
      <Transition>
        <UChip class="transition-all" v-if="table.selected.length > 0" :text="table.selected.length" size="xl"
          color="red">
          <UButton :loading="loading.delete" color="red" :ui="{ rounded: 'rounded-full' }"
            @click="modals.confirmDelete.display = true, loading.delete = true">
            <UIcon class="font-bold text-xl" name="i-material-symbols-light-delete" />Delete
          </UButton>
        </UChip>
        </Transition>
        <TransitionGroup>
          <UDivider v-if="table.selected.length==pageCount" label="or" type="dotted"/>
        <UChip v-if="table.selected.length==pageCount" class="transition-all"  :text="table.data.length" size="xl"
          color="red">
          <UButton :loading="loading.delete" color="red" :ui="{ rounded: 'rounded-full' }"
            @click="modals.confirmDelete.display = true, loading.delete = true">
            <UIcon class="font-bold text-xl" name="i-material-symbols-light-delete" />Delete all records
          </UButton>
        </UChip>
      </TransitionGroup>
      
    </div>
    <UInput v-model="table.keyword" placeholder="Filter people..." />
  </div>

  <UTable :rows="rows" :columns="table.columns" v-model="table.selected" :loading="table.loading">
    <template #actions-data="{ row }">
      <UButton color="blue" icon="i-material-symbols-light-info-outline-rounded" variant="ghost"
        :ui="{ rounded: 'rounded-full' }" @click="table.detail={display:true,value:row}"/>
    </template>
  </UTable>
  <UDivider class="mb-2" />
  <div class="flex justify-center mt-auto mb-2 w-full">
    <UPagination v-model="table.page" :page-count="pageCount" :total="table.data.length" />
  </div>

  <KeepAlive>
    <AdministratorCategoriesCreateNew v-model="modals.createForm.display"
      @confirm-window="(display, title) => { modals.confirmClose.display = display, modals.confirmClose.title = title }"
      @newData="table.data.push($event), store.showNotification({ type: 'success', title: $event.title + ' created success', description: 'You can view in data table', timeout: 3000 })" />
  </KeepAlive>
  <ConfirmModal v-model="modals.confirmDelete.display" :title="modals.confirmDelete.title"
    @is-confirmed="$event ? deleteSelected() : loading.delete = false" />
  <ConfirmModal v-model="modals.confirmClose.display" :title="modals.confirmClose.title"
    @is-confirmed="$event ? modals.createForm.display = false : null" />
    <UModal :ui="{ width: `sm:max-w-6xl`, overlay: { background: 'backdrop-blur-md' } }" v-model="table.detail.display"
    :fullscreen="basicStore.screenSize.w < 800 ? true : false" prevent-close>
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
          <h3 class="capitalize text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ table.detail.value.title }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="table.detail.display=false" />
        </div>
      </template>
      <AdministratorCategoriesDetail :data="table.detail.value"/>
      </UCard>
    </UModal>
</template>

<script lang="ts" setup>
const store = useMyNotificationsStore()
const basicStore = useMyBasicStore()
onBeforeMount(async () => {
  table.value.loading = true
  await $fetch('/api/categories/list').then(res => {
    if (res.length > 0) {
      table.value.data = res
    }
    table.value.loading = false
  })
})


const modals = ref({
  createForm: {
    display: false
  },
  confirmDelete: {
    display: false,
    title: 'Do you sure delete item?'
  },
  confirmClose: {
    display: false,
    title: 'Do you sure close this window?'
  }
})
const loading = ref({
  delete: false,
  create: false
})
const table = ref({
  page: 1,
  pageCount: 10,
  columns: [
    { key: '_id', label: 'ID' },
    { key: 'title', label: 'Name' },
    { key: 'actions' }
  ],
  selected: [],
  keyword: null,
  data: [],
  loading: false,
  detail:{
    display:false,
    value:null
  }
})
const rows = computed(() => {
  return table.value.data.slice((table.value.page - 1) * pageCount.value, (table.value.page) * pageCount.value)
})
const pageCount = computed(() => {
  return Math.floor((basicStore.screenSize.h - 84 - 61 - 48.5 - 32) / 65)

})
const filteredRows = computed(() => {
  if (!table.value.keyword) {
    return table.value.data
  }

  return table.value.data.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(table.value.keyword.toLowerCase())
    })
  })
})
async function deleteSelected() {
  table.value.selected.forEach(async (item, index) => {
    await $fetch('/api/categories/delete', {
      method: 'DELETE',
      body: {
        _id: item._id
      }
    }).then(res => {
      if (Object.hasOwn(res, 'deletedCount') && res.deletedCount == 1) {
        store.showNotification({
          title:`${item._id} deleted success`,
          description:`with name: <span class="text-red-500 font-bold text-xl">${item.title}</span>`,
          type:'success'
        })
        table.value.data.forEach((item1, index1) => {
          if (item._id == item1._id) {
            table.value.data.splice(index1, 1)
          }
        })
      }
    })
  })
  table.value.selected = []
  loading.value.delete = false
}
const confirmDeleteDisplay = computed({
  get() {
    return modals.value.confirmDelete.display
  }
})
watch(confirmDeleteDisplay, (newVal, oldVal) => {
  if (!newVal) {
    loading.value.delete = false
  }

})

</script>

<style></style>