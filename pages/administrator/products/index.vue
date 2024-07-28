<template>
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-1">
        <UButton class="capitalize" :ui="{rounded:'rounded-full'}" @click="modals.createForm.display=true"><UIcon class="font-bold text-xl" name="i-material-symbols-light-add"/>Create new product</UButton>
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

      <AdministratorProductsCreateNew v-model="modals.createForm.display" @confirm-window="(display,title)=>{modals.confirmClose.display=display,modals.confirmClose.title=title}" @new-data="table.data.unshift($event)"/>

    <ConfirmModal v-model="modals.confirmDelete.display" :title="modals.confirmDelete.title" @is-confirmed="$event?deleteSelected():loading.delete=false"/>
    <ConfirmModal v-model="modals.confirmClose.display" :title="modals.confirmClose.title" @is-confirmed="$event?modals.createForm.display=false:null"/>
</template>

<script lang="ts" setup>

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
    {key:'name',label:'Name'},
    {key:'email',label:'Email'},
    {key:'role',label:'Role'},
    {key:'actions'}
  ],
  selected:[],
  keyword:null,
  data:[]
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