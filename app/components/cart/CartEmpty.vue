<template>
  <div class="w-full flex flex-col justify-center items-center my-8">
    <NuxtImg
      :src="cart"
      class="h-40"
    />

    <h1 class="font-bold text-2xl mt-2">
      Your cart is still empty
    </h1>
    <p class="mb-2">
      Find your favorite items and add to cart before check out.
    </p>

    <NuxtLink to="/products">
      <UButton
        label="Find Products"
        size="xl"
        class="w-50 cursor-pointer"
        :ui="{
          base: 'w-full flex justify-center'
        }"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import cart from '~/assets/img/cart.svg'
</script>
