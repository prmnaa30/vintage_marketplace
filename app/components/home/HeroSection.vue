<template>
  <div class="hero-section">
    <img
      src="~/assets/img/banner.jpg"
      alt="Hero Section Banner"
      class="h-full w-full object-cover"
    >

    <div class="absolute bg-white rounded-lg shadow-md w-70 p-4 top-65 left-24">
      <p class="mb-6 text-2xl">
        Ready to declutter your closet?
      </p>
      <NuxtLink to="/products">
        <UButton
          label="Shop Now"
          size="xl"
          class="w-full cursor-pointer"
          :ui="{ base: 'w-full flex justify-center' }"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.hero-section {
  @apply h-[calc(100vh-var(--header-height))] relative
}
</style>
