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
    <div ref="tableEl">
      <UTable :rows="filteredRows" :columns="table.columns" v-model="table.selected">
      <template #actions-data="{row }">
        <UButton color="blue" icon="i-material-symbols-light-info-outline-rounded" variant="ghost" :ui="{rounded: 'rounded-full'}"/>
      </template>
      <template #images-data="{row}">
        <div class="relative flex justify-center" @dblclick="router.push('products/detail-' + row._id)">
        <template v-if="row.images.small.length >= 1">
          <div class="w-12 h-12 bg-gray-400 rounded-md" v-if="row.images.small.length > 1"></div>
          <div :class="row.images.small.length > 1 ? 'absolute top-0 left-1 shadow-2xl' : ''">
            <img :src="row.images.small[0]" class="w-12 drop-shadow-xl rounded-md" />
          </div>
          <UBadge v-if="row.images.small.length > 1" :label="(row.images.small.length - 1) + '+'"
            class="absolute right-0 top-0 " size="xs"></UBadge>
        </template>
        <template v-else>
          <div
            class="w-12 h-12 bg-gray-400 dark:bg-gray-800 rounded-md capitalize text-xs flex justify-center items-center text-gray-800 dark:text-gray-400">
            no data</div>
        </template>
      </div>
        
      </template>
    </UTable>
    </div>
    
    <UDivider class="mb-2" />
  <div class="flex justify-center mt-auto mb-2 w-full">
    <UPagination v-model="table.page" :page-count="pageCount" :total="table.data.length" />
  </div>
      <AdministratorProductsCreateNew v-if="modals.createForm.display" v-model="modals.createForm.display" @confirm-window="(display,title)=>{modals.confirmClose.display=display,modals.confirmClose.title=title}" @new-data="table.data.unshift($event)"/>

    <ConfirmModal v-model="modals.confirmDelete.display" :title="modals.confirmDelete.title" @is-confirmed="$event?deleteSelected():loading.delete=false"/>
    <ConfirmModal v-model="modals.confirmClose.display" :title="modals.confirmClose.title" @is-confirmed="$event?modals.createForm.display=false:null"/>
</template>

<script lang="ts" setup>
const router=useRouter()
const basicStore=useMyBasicStore()
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
const tableEl=ref(null)
const table=ref({
  columns:[
    {key:'_id',label:'ID'},
    {key:'images',label:'Images'},
    {key:'name',label:'name'},
    {key:'description',label:'Description'},
    {key:'note',label:'Note'},
    {key:'tags',label:'Tags'},
    {key:'created_at',label:'Created at'},
    {key:'created_by',label:'Created by'},
    {key:'edited_at',label:'Edited at'},
    {key:'edited_by',label:'Edited by'},
    {key:'actions'}
  ],
  selected:[],
  keyword:null,
  data:[],
  page: 1,
  pageCount: 10,
})
const pageCount = computed(() => {
  if(tableEl.value ){
    console.log(tableEl.value.offsetTop)
    return Math.floor((basicStore.screenSize.h-tableEl.value.offsetTop-32-68.5) / 80.5)
  }
  
  return Math.floor((basicStore.screenSize.h - 84 - 61 - 48.5 - 32) / 65)

})
onMounted(async ()=>{
  await $fetch('/api/products/list').then(res=>{
    table.value.data=res
  })
})
const filteredRows = computed(() => {
  if (!table.value.keyword) {
    return table.value.data.slice((table.value.page - 1) * pageCount.value, (table.value.page) * pageCount.value)
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