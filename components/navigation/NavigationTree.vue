<script setup lang="ts">
import { includes } from 'lodash';
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
const test=ref(false)
const issetMenu=computed(()=>{
  let v=false
  test.value=false
  items.forEach(item=>{
    if(item.hasOwnProperty('items')){
      item.items.forEach(itc=>{
        if(itc.to==myRoute.value){
          v=true
          test.value=true
        }
      })
    }
  })
  return v
})
const myAccordion=ref(null)
function closeAll() {
  myAccordion.value[0].buttonRefs.forEach((btn) => btn.close());
}
onBeforeMount(()=>{
  console.log(myRoute.value.indexOf('detail')>-1)
})
</script>

<template>
  <div class="">
    <h1 class="text-center py-5 text-red-500 font-bold items-center flex justify-center gap-1 text-4xl" @click="isDark=!isDark">PDM<UIcon :name="isDark?'i-material-symbols-light-dark-mode-outline-rounded':'i-material-symbols-light-light-mode-outline'" /></h1>
    <div class="w-full flex justify-center">
    </div>
    <div class="flex flex-col">
      <template v-for="item in items">
        <UButton color="red" :to="item.to" v-if="!item.hasOwnProperty('items')" :variant="myRoute==item.to||item.childs?.forEach(c=>)?'soft':'ghost'" size="xl" :ui="{base:'border-l-2 '+(myRoute==item.to?'border-red-500':''), rounded: 'rounded-none', padding: { sm: 'p-3' } }" @click="closeAll">
        <template #leading>
          <div>
            <UIcon dynamic :name="item.icon" />
          </div>
        </template>

        <span class="font-bold">{{ item.label }}</span>

      </UButton>
      <UAccordion v-else :items="[item]" ref="myAccordion" :unmount="true" :default-open="issetMenu">
        <template #default="{item,open,index}">
          <UButton color="red" :variant="issetMenu?'soft':'ghost'" size="xl" :ui="{ base:'border-l-2 '+(issetMenu?'border-red-500':''),rounded: 'rounded-none', padding: { sm: 'p-3' } }">
        <template #leading>
          <div>
            <UIcon dynamic :name="item.icon" />
          </div>
        </template>

        <span class="font-bold">{{ item.label }}</span>
        <template #trailing>
          <UIcon
            name="i-heroicons-chevron-right-20-solid"
            class="w-5 h-5 ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </template>
      </UButton>
        </template>
        <template #item="{item}">
          <div class="pl-6">
            <ULink class="block border-l  hover:border-red-500 pl-4 capitalize text-red-800 hover:text-red-500" :class="myRoute==itc.to?'border-red-500':'border-gray-200'" v-for="itc in item.items" :to="itc.to">{{ itc.label }}</ULink>
          </div>
          
      </template>
      </UAccordion>
      </template>
    </div>
  </div>
</template>

