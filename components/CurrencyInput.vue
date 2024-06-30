<template>
  <UInput ref="inputRef"/>
</template>
<script setup>
import { useCurrencyInput } from 'vue-currency-input'
const props=defineProps(['value','options'])

const { inputRef } = useCurrencyInput(props.options)
</script>
