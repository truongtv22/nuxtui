<template>
  <div class="grow px-4 py-5 sm:p-6" >
    <CreateForm @newData="createdNewData($event)"/>
  </div>
</template>

<script lang="ts" setup>
import CreateForm from '@@/components/administrator/categories/CreateNew.vue'

const notification=useMyNotificationsStore()

const emits=defineEmits(['newData'])
function createdNewData(data){
  notification.showNotification({
      title: `${data.title} <span class="text-green-500">created</span> success`,
      type: 'success'
    })
}

</script>

<style>

</style>