<template>
  <main>
    <HomeHeroSection />

    <UContainer
      id="product"
      class="scroll-mt-[calc(var(--header-height))]"
    >
      <ProductContainer
        container-type="Display"
        label="Popular Items"
        :href="{
          type: 'link',
          link: '/products'
        }"
        :display-cols-size="6"
        :products="popularProducts"
        :is-loading="productStore.isLoading"
      />
      <BrandFilter />
      <ProductContainer
        container-type="Display"
        label="New Products"
        :href="{
          type: 'link',
          link: '/products'
        }"
        :display-cols-size="6"
        :products="newProducts"
        :is-loading="productStore.isLoading"
      />
    </UContainer>
  </main>
</template>

<script setup lang="ts">
import BrandFilter from '~/components/home/BrandFilter.vue'
import type { ProductCardType } from '~/types'

const productStore = useProductStore()

await productStore.fetchHomeData()

const popularProducts = productStore.popularProducts as ProductCardType[]
const newProducts = productStore.newProducts as ProductCardType[]
</script>
