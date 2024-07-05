<template>
    <UInput v-model="modelValue" @keypress="isNumber" @change="calculate(modelValue)" :model-value="!isFocus?formatted(modelValue):modelValue" @focus="isFocus=true" @blur="isFocus=false"/>
</template>

<script lang="ts" setup>
  const props=defineProps(['modelValue'])
  const emits=defineEmits(['update:modelValue','quantity'])
const modelValue=computed({
  get(){
    return props.modelValue
  },
  set(val){
    emits('update:modelValue',val)
  }
})
const isFocus=ref(false)
function formatted(val){
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' ,minimumFractionDigits: 0,
  maximumFractionDigits: 20}).format(
    val
  )
}
function calculate(val){
  if(val.indexOf('/')>-1 && val.split('/').length==2 && val.split('/')[1].length>0){
    emits('quantity',val.split('/')[1])
  }
  modelValue.value=String(Math.round(eval(val)*10000)/10000)
}
function isNumber(evt){
  evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode>=46 && charCode <=57) || charCode==191 || charCode==45 || charCode==43 || charCode==40 || charCode==41 || charCode==42) {
        return true
      } else {
        evt.preventDefault()
      }
}
</script>

<style>

</style>