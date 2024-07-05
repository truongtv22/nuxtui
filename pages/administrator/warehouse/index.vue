<script setup lang="ts">
const route = useRoute()
const router = useRouter()
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
}, {
  key: 'actions',
  label: ''
}
]

const people = ref([{
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
}])

const q = ref('')

const filteredRows = computed(() => {
  if (!q.value) {
    return people.value
  }

  return people.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
const modal=ref({
  display:false
})
const productList=ref({
  display:false,
  data:[]
})
const itemsSelected=ref([])
function deleteItem(){
  itemsSelected.value.forEach((item,index)=>{
    people.value.forEach((item1,index1)=>{
      if(item.id==item1.id){
        people.value.splice(index1,1)
      }
    })
  })
  itemsSelected.value=[]
}
const confirmModal=ref({
  display:false,
  title:'Do you sure want delete selected item?'
})
const confirmTitle=computed({
  get(){
    return `Do you sure want delete selected item${itemsSelected.value.length>1?'s':''}?`
  }
})
</script>

<template>
  <div>
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-1">
        <UButton class="capitalize" :ui="{rounded:'rounded-full'}" @click="modal.display=true"><UIcon class="font-bold text-xl" name="i-material-symbols-light-add"/>Insert new record</UButton>
        <Transition>
          <UChip class="transition-all" v-if="itemsSelected.length>0" :text="itemsSelected.length" size="xl" color="red">
        <UButton  color="red" :ui="{rounded:'rounded-full'}" @click="confirmModal.display=true"><UIcon class="font-bold text-xl" name="i-material-symbols-light-delete"/>Delete</UButton>
  </UChip>
        </Transition>
        
        
      </div>
      
      <UInput v-model="q" placeholder="Filter people..." />
    </div>

    <UTable :rows="filteredRows" :columns="columns" v-model="itemsSelected">
      <template #actions-data="{row }">
        <UButton color="blue" icon="i-material-symbols-light-info-outline-rounded" variant="ghost" :ui="{rounded: 'rounded-full'}"/>
      </template>
    </UTable>
    <KeepAlive>
      <AdministratorWarehouseCreateNew :display="modal.display" @display="modal.display=$event" />
    </KeepAlive>
    <ConfirmModal v-model="confirmModal.display" :title="confirmTitle" @is-confirmed="$event?deleteItem():''"/>
    
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: all .5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>