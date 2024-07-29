<template>
  <USelectMenu multiple v-model="selected" :options="data" :optionAttribute="props.name"
            :optionValue="props.value" :creatable="!status.loading" searchable :loading="status.loading" :disabled="status.loading" ref="categories">
            <template #label>
              <div class="w-auto flex flex-row" v-if="selected.length > 0">
                <div v-for="item, key in selected" ref="selectEl" class="w-auto">
                  <UBadge v-if="selectedCalculator(selectEl.slice(0, key)) < categories.$refs.trigger.el.clientWidth - 220"
                    class="mr-1">{{ item.name }}</UBadge>
                </div>
              </div>
              <span v-else class="text-gray-400">Select category</span>
              <span class="w-auto"
                v-if="selected.length - selected.filter((item, index) => { return selectedCalculator(selectEl.slice(0, index)) < categories.$refs.trigger.el.clientWidth - 220 }).length > 1">+{{
                  selected.length - selected.filter((item, index) => {
                    return selected.slice(0, index).reduce((val1, val2) => val1 + val2.clientWidth, 0) < categories.$refs.trigger.el.clientWidth-220}).length
                  }} items</span>

            </template>
            <template #option-create="{ option }">
                <span class="flex-shrink-0">New label:</span>
              <span class="flex-shrink-0 w-2 h-2 mt-px rounded-full -mx-1" />
              <span class="block truncate">{{ option.name }}</span>

              

            </template>
          </USelectMenu>
</template>

<script lang="ts" setup>
const props=defineProps({
    data:{},
    name:{
      default:'name'
    },
    value:{
      default:'_id'
    },
    selected:{}
})
const emits=defineEmits(['selected'])
const selected=computed({
  get(){
    return props.selected
  },
  async set(val){
    const promise=val.map(async (item)=>{
      if(item._id){
        return item
      }
      status.value.loading=true
      return await $fetch('/api/categories/create',{
        method:"POST",
        body:JSON.stringify({
          name:item.name
        })
      }).then(res=>{
        if(res.length>0){
          status.value.loading=false
          props.data.push(res[0])
          return res[0]
        }
      })
    })
    const res=await Promise.all(promise)
    emits('selected',res)
  }
})
const selectEl=ref([]),
skipUnwrap={selectEl},
categories=ref(null),
status=ref({
  loading:false
})
function selectedCalculator(arr) {
  return arr.reduce((val1, val2) => val1 + val2.clientWidth, 0)
}

</script>

<style>

</style>