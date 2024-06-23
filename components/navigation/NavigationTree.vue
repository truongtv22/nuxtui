<script setup lang="ts">
const menu=useMyMenuItemsStore()
const items = menu.admin
const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
const route=useRoute()
const myRoute=computed({
  get(){
    return route.fullPath
  }
})
</script>

<template>
  <div class="">
    <h1 class="text-center py-5 text-red-500 font-bold items-center flex justify-center gap-1 text-4xl" @click="isDark=!isDark">PDM<UIcon :name="isDark?'i-material-symbols-light-dark-mode-outline-rounded':'i-material-symbols-light-light-mode-outline'" /></h1>
    <div class="w-full flex justify-center">
    </div>
    
      
    <UAccordion :items="items" color="red" >
    <template #default={item,index,open}>
      <UButton color="red" :variant="myRoute==item.to?'solid':'ghost'" size="xl" class="font-bold" :to="item.to">
        <template #leading>
            <UIcon dynamic :name="item.icon" color="red" class="w-4 h-4 text-white dark:text-gray-900" />

        </template>

        <span class="truncate">{{ item.label }}</span>

        <template #trailing v-if="item.items && item.item.length>0">
          <UIcon
            name="i-heroicons-chevron-right-20-solid"
            class="w-5 h-5 ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </template>
      </UButton>
      
    </template>
      <template #item="{item}">
        <h3 v-if="item.content" >{{item.content}}</h3>
        <template v-else-if="item.items && item.items.length>0"class="flex flex-column">
          <ULink class="block border-l border-red-800 hover:border-red-500 pl-4 capitalize text-red-800 hover:text-red-500" v-for="itc in item.items" :to="itc.to">{{ itc.label }}</ULink>
        </template>
      </template>
    </UAccordion>
    
  </div>
  
    
  
</template>

