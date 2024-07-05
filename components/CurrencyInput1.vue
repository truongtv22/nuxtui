<template>
  <div>
    <UInput v-model="currency" @change="calculate(currency)" :model-value="!test?formatted(currency):currency" @focus="test=true" @blur="test=false"/>
  </div>
</template>

<script lang="ts" setup>
const currency=ref(null)
const test=ref(false)
function formatted(val){
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' ,minimumFractionDigits: 0,
  maximumFractionDigits: 20}).format(
    val
  )
}
function calculate(newVal){
  console.log(newVal.indexOf('/'))
  if(newVal.indexOf('/')>-1 && newVal.split('/').at(-1).length>0){
    let arr=newVal.split('/')
    currency.value=String(Math.round(arr[0]/arr[1]*1000)/1000)
  }
}
</script>

<style>

</style>