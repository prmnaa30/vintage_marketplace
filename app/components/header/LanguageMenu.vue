<template>
  <USelect
    v-model="value"
    color="neutral"
    variant="ghost"
    :items="items"
  />
</template>

<script setup lang="ts">
const items = ref(['EN', 'ID'])
const value = ref('EN')
</script>
