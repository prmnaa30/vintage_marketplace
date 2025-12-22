<template>
  <div
    class="flex flex-col items-center gap-2 text-center w-80 mx-auto"
  >
    <NuxtImg
      :src="bagCross"
      alt="Product not found"
      class="h-30"
    />

    <h1 class="font-bold text-2xl">
      Product not found
    </h1>

    <p class="text-sm">
      We cannot find what you were looking for, try to use other keywords or
      reset keywords
    </p>

    <UButton
      label="Reset Keywords"
      class="w-60 cursor-pointer mt-2"
      :ui="{
        base: 'w-full flex justify-center'
      }"
      @click="onResetKeywords"
    />
  </div>
</template>

<script setup lang="ts">
import bagCross from '~/assets/img/bag-cross.svg'

defineProps<{
  onResetKeywords: VoidFunction
}>()
</script>
