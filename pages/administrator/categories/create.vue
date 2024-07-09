<template>
  <div class="px-4">
    <CreateForm/>
  </div>
</template>

<script lang="ts" setup>
import CreateForm from '@@/components/administrator/categories/CreateNew.vue'
const nuxt=useNuxtApp()
const isOpen=ref(true)
</script>

<style>

</style>