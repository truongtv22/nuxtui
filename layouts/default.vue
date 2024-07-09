<template>
  <div class="flex justify-content-center">
    <UContainer class="flex flex-col xl:flex-row" :ui="ui">
      <NavigationTree class="w-80 min-w-12 max-w-80 hidden xl:block" />
      <div class="flex justify-between p-2 relative items-center block xl:hidden">
        <div>
          <UButton color="red" icon="i-material-symbols-light-more-vert" variant="ghost" class="mr-2" size="xl" :ui="{ rounded: 'rounded-full' }" @click="isOpen.right=!isOpen.right" />
        </div>
        
      <div>
        <h1 class="text-center text-red-500 font-bold items-center flex justify-center gap-1 text-4xl" @click="isDark=!isDark">PDM<UIcon :name="isDark?'i-material-symbols-light-dark-mode-outline-rounded':'i-material-symbols-light-light-mode-outline'" /></h1>
      </div>
        <div class="flex">
          <UButton icon="i-material-symbols-light-notifications-outline-sharp" color="blue" variant="ghost"
                :ui="{ rounded: 'rounded-full' }" size="xl" @click="isOpen.left = !isOpen.left" />

              <UPopover mode="hover">
                <UButton icon="i-material-symbols-light-add" color="green" variant="ghost"
                  :ui="{ rounded: 'rounded-full' }" size="xl" />

                <template #panel>
                  <div class="p-1 flex flex-col">
                    <UButton icon="i-material-symbols-light-person-add-outline" color="gray" variant="ghost">Create new
                      user</UButton>
                    <UButton icon="i-material-symbols-light-send-outline-rounded" color="gray" variant="ghost">Send
                      email</UButton>
                  </div>
                </template>
              </UPopover>
        </div>
        
      </div>
      <UDivider orientation="horizontal" :ui="{ border: { base: 'dark:border-gray-600' } }" class="block xl:hidden" />
      <UDivider orientation="vertical" :ui="{ border: { base: 'dark:border-gray-600' } }" class="hidden mdForNav:block" />
      <div class="w-full flex flex-col min-h-screen">
        <ClientOnly>
          <div class="flex justify-between xl:py-5 px-3 py-2">
            <div class="flex flex-col">
              <h1 class="capitalize  font-bold flex items-center" v-if="props.title">{{ props.title }}</h1>
            <h1 class="capitalize  font-bold flex items-center" v-if="props.breadcumb">
              <UBreadcrumb
    divider="/"
    :links="props.breadcumb"
  />
            </h1>
            </div>
            
            <div class="hidden xl:flex">
              <UButton icon="i-material-symbols-light-notifications-outline-sharp" color="blue" variant="ghost"
                :ui="{ rounded: 'rounded-full' }" size="xl" @click="isOpen.left = !isOpen.left" />

              <UPopover mode="hover">
                <UButton icon="i-material-symbols-light-add" color="green" variant="ghost"
                  :ui="{ rounded: 'rounded-full' }" size="xl" />

                <template #panel>
                  <div class="p-1 flex flex-col">
                    <UButton icon="i-material-symbols-light-person-add-outline" color="gray" variant="ghost">Create new
                      user</UButton>
                    <UButton icon="i-material-symbols-light-send-outline-rounded" color="gray" variant="ghost">Send
                      email</UButton>
                  </div>
                </template>
              </UPopover>
            </div>
          </div>
          <USlideover v-model="isOpen.left">
            <UCard class="flex flex-col flex-1"
              :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <div class="flex justify-between">
                  <h1>Notifications</h1>
                  <UButton icon="i-material-symbols-light-close" color="red" variant="ghost" @click="isOpen.left = false"
                    :ui="{ rounded: 'rounded-full' }" />
                </div>
              </template>

              <div class="flex items-center space-x-4 my-2 w-full" v-for="n in 20">
                <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
                <div class="space-y-2">
                  <USkeleton class="h-4 w-[250px]" />
                  <USkeleton class="h-4 w-[200px]" />
                </div>
              </div>

            </UCard>
          </USlideover>
          <USlideover v-model="isOpen.right" side="left">
            <UCard class="flex flex-col flex-1"
              :ui="{ body: { base: 'flex-1',padding:'p-0 sm:p-0' },header:{padding:'sm:py-2 sm:px-2'}, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <div class="flex justify-between">
                  <h1>Menu</h1>
                  <UButton icon="i-material-symbols-light-close" color="red" variant="ghost" @click="isOpen.right = false"
                    :ui="{ rounded: 'rounded-full' }" />
                </div>
              </template>
<UDivider orientation="horizontal" class="mb-2"/>
              <UAccordion :items="items" color="red" >
      <template #item="{item}" >
        <h3 v-if="item.content" >{{item.content}}</h3>
        <template v-else class="flex flex-column">
          <ULink class="block border-l border-red-800 hover:border-red-500 pl-4 capitalize text-red-800 hover:text-red-500" v-for="itc in item.items" :to="itc.to">{{ itc.label }}</ULink>
        </template>
      </template>
    </UAccordion>

            </UCard>
          </USlideover>
        </ClientOnly>
        <UDivider orientation="horizontal" :ui="{ border: { base: 'dark:border-gray-600' } }" />
          <slot class="w-full" />
        
      </div>



    </UContainer>

  </div>
</template>

<script lang="ts" setup>
import NavigationTree from '~/components/navigation/NavigationTree.vue';
import { useMyMenuItemsStore } from '~/stores/menu-items';

const menu=useMyMenuItemsStore()
const props = defineProps(['title','breadcumb'])
const ui = ref({
  constrained: 'max-w-full w-full',
  padding: 'px-0 lg:px-0',
  base: 'text-xl'
})
const isOpen = ref({
  left:false,
  right:false
})
const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
const items = menu.admin
</script>

<style></style>