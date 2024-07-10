<template>
  <div>
    <NuxtLayout :title="title" :breadcumb='breadcumb'>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
    <UNotifications :icon="store.icon" :ui="{ position: 'top-0', wrapper: 'justify-start h-fit' }">
      <template #title="{ title }">
        <span v-html="title" />
      </template>

      <template #description="{ description }">
        <span v-html="description" />
      </template>
    </UNotifications>
  </div>
</template>
<script setup>
useHead({
    titleTemplate: (titleChunk
      ) => {
        return titleChunk? `${titleChunk} - PDM Phuong Do Mega` : 'PDM Phuong Do Mega';
      }
  })
const store = useMyNotificationsStore()
const basicStore = useMyBasicStore()
const route = useRoute()
const pages = useMyMenuItemsStore()
onMounted(() => {
  basicStore.updateSizeScreen({ w: window.innerWidth, h: window.innerHeight })
  window.addEventListener('resize', () => {
    basicStore.updateSizeScreen({ w: window.innerWidth, h: window.innerHeight })
  })
})
const breadcumb = ref(null)
const title = computed(() => {
  let val = null
  breadcumb.value = null
  const st = route.fullPath.split('/').slice(1)
  const st1 = []
  let st2 = ''
  st.forEach((item1, index) => {
    st2 += '/' + item1
    st1.push({ label: 'administrator' == item1.toLowerCase() ? (st.length > 1 ? 'Dashboard' : 'Home') : (item1.charAt(0).toUpperCase() + item1.slice(1)), to: st2 })
  })
  breadcumb.value = st1
  pages.admin.forEach(item => {
    console.log(route.fullPath)
    if (item.to == route.fullPath) {
      val = item.label
      useSeoMeta({
        title: item.label.charAt(0).toUpperCase() + item.label.slice(1) 
      })
    }
    else if (item.hasOwnProperty('items')) {
      item.items.forEach(itc => {
        if (itc.to == route.fullPath) {
          val = itc.label
          useSeoMeta({
            title: itc.label.charAt(0).toUpperCase() + itc.label.slice(1)
          })
        }
      })
    }
    else if (route.fullPath.indexOf(item.to) > -1 && Object.hasOwn(item, 'childs')) {
      item.childs.forEach(child => {
        if (child.to == route.fullPath) {
          val = child.label
        }
      })

    }
  })
  return val
})


</script>