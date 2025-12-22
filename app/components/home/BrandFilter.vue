<template>
  <div class="my-12">
    <h1 class="font-bold text-lg mb-4">
      Shop by Brand
    </h1>

    <div class="w-full flex flex-wrap gap-2">
      <NuxtLink
        v-for="(brandItem, index) in brand"
        :key="index"
        :to="`/products?brand=${encodeURIComponent(brandItem)}`"
        class="grow"
      >
        <UButton variant="outline" color="neutral" class="w-full cursor-pointer" :ui="{ base: 'w-full flex justify-center' }">
          {{ brandItem }}
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const brand = [
  'The North Face',
  'Generic',
  'Levi\'s',
  'Vintage',
  'Zara',
  'Dr. Martens',
  'H&M',
  'Nike',
  'Uniqlo',
  'Adidas'
]
</script>
