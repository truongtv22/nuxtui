<template>
  <div class="min-w-96 min-h-96 flex flex-col gap-y-2 text-center relative z-20 justify-center items-center">
    <h1 class="text-2xl capitalize font-bold">login</h1>
    <div class="min-w-96 border border-gray-400 rounded-md p-10 gap-y-4 flex flex-col py-16">
      <UForm class="w-full flex flex-col gap-y-2 justify-center">
        <UFormGroup label="Username / Email" name="username">
          <UInput />
        </UFormGroup>
        <UButton block class="text-center" type="submit">Continue</UButton>
      </UForm>
      <UDivider label="or"/>
      <UButton block type="submit" color="gray"><Icon name="logos:google-icon" style="color: black" />Continue with Google</UButton>
      <UButton block class="text-center" color="gray" type="submit"><Icon name="logos:facebook" style="color: black" />Continue with Facebook</UButton>
      <UButton block class="text-center" color="gray" type="submit"><Icon name="grommet-icons:github" style="color: black" />Continue with Github</UButton>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { z } from 'zod';


definePageMeta({
  layout: 'login-layout'
})
const schema=z.object({
  
})
</script>

<style></style>