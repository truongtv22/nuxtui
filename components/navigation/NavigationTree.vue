<script setup lang="ts">

const items = [{
  label: 'Getting Started',
  icon: 'i-heroicons-information-circle',
  defaultOpen: true,
  items:[
    {label:'home',to:'/'},
    {label:'about',to:'/about'},
    {label:'contact',to:'/contact'}
  ]
}, {
  label: 'Installation',
  icon: 'i-heroicons-arrow-down-tray',
  disabled: true,
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Theming',
  icon: 'i-heroicons-eye-dropper',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Layouts',
  icon: 'i-heroicons-rectangle-group',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Components',
  icon: 'i-heroicons-square-3-stack-3d',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Utilities',
  icon: 'i-heroicons-wrench-screwdriver',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
},
]
const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

</script>

<template>
  <div class="">
    <h1 class="text-center py-5 pb-0 text-red-500 font-bold items-center flex justify-center gap-1" @click="isDark=!isDark">PDM<UIcon :name="isDark?'i-material-symbols-light-dark-mode-outline-rounded':'i-material-symbols-light-light-mode-outline'" /></h1>
    <div class="w-full flex justify-center">
    </div>
    
      
    <UAccordion :items="items" color="secondary">
      <template #item="{item}" >
        <h3 v-if="item.content">{{item.content}}</h3>
        <template v-else class="flex flex-column">
          <ULink class="block border-l border-slate-600 hover:border-slate-200 pl-4" v-for="itc in item.items" :to="itc.to">{{ itc.label }}</ULink>
        </template>
      </template>
    </UAccordion>
    
  </div>
  
    
  
</template>

