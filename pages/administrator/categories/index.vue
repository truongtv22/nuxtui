<template>
  <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-1">
        <UButton class="capitalize" :ui="{rounded:'rounded-full'}" @click="modals.createForm.display=true"><UIcon class="font-bold text-xl" name="i-material-symbols-light-add"/>Create new category</UButton>
        <Transition>
          <UChip class="transition-all" v-if="table.selected.length>0" :text="table.selected.length" size="xl" color="red">
        <UButton :loading="loading.delete" color="red" :ui="{rounded:'rounded-full'}" @click="modals.confirmDelete.display=true,loading.delete=true"><UIcon class="font-bold text-xl" name="i-material-symbols-light-delete"/>Delete</UButton>
  </UChip>
        </Transition>
      </div>
      <UInput v-model="table.keyword" placeholder="Filter people..." />
    </div>

    <UTable :rows="filteredRows" :columns="table.columns" v-model="table.selected">
      <template #actions-data="{row }">
        <UButton color="blue" icon="i-material-symbols-light-info-outline-rounded" variant="ghost" :ui="{rounded: 'rounded-full'}"/>
      </template>
    </UTable>
    <KeepAlive>
      <AdministratorCategoriesCreateNew v-model="modals.createForm.display" @confirm-window="(display,title)=>{modals.confirmClose.display=display,modals.confirmClose.title=title}" />
    </KeepAlive>
    <ConfirmModal v-model="modals.confirmDelete.display" :title="modals.confirmDelete.title" @is-confirmed="$event?deleteSelected():loading.delete=false"/>
    <ConfirmModal v-model="modals.confirmClose.display" :title="modals.confirmClose.title" @is-confirmed="$event?modals.createForm.display=false:null"/>
</template>

<script lang="ts" setup>
onBeforeMount(async ()=>{
  await $fetch('/api/categories/list').then(res=>{
    if(res.length>0){
      table.value.data=res
    }
  })
})
const modals=ref({
  createForm:{
    display:false
  },
  confirmDelete:{
    display:false,
    title:'Do you sure delete item?'
  },
  confirmClose:{
    display:false,
    title:'Do you sure close this window?'
  }
})
const loading=ref({
  delete:false,
  create:false
})
const table=ref({
  columns:[
    {key:'_id',label:'ID'},
    {key:'title',label:'Name'},
    {key:'actions'}
  ],
  selected:[],
  keyword:null,
  data:[{
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
}]
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
function deleteSelected(){
  table.value.selected.forEach((item,index)=>{
    table.value.data.forEach((item1,index1)=>{
      if(item.id==item1.id){
        table.value.data.splice(index1,1)
      }
    })
  })
  table.value.selected=[]
  loading.value.delete=false
}
const confirmDeleteDisplay=computed({
  get(){
    return modals.value.confirmDelete.display
  }
})
watch(confirmDeleteDisplay,(newVal,oldVal)=>{
  if(!newVal){
    loading.value.delete=false
  }
  
})
</script>

<style>

</style>