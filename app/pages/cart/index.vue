<template>
  <UContainer class="grid grid-cols-6 gap-6 my-8">
    <section class="col-span-4">
      <CartContainer />

      <ProductContainer
        container-type="Display"
        label="Other Products"
        :display-cols-size="4"
        :products="randomProducts"
        :is-loading="productStore.isLoading"
      />
    </section>

    <UCard
      class="col-span-2 h-fit"
      as="section"
    >
      <div class="mb-4">
        <div class="flex justify-between font-bold">
          <h3>Order Summary</h3>
          <p>Rp{{ cartStore.getTotalPrice }}</p>
        </div>

        <div class="flex justify-between text-sm text-muted">
          <p>{{ cartStore.getTotalItems }} items</p>
          <p>Shipping fee excluded</p>
        </div>
      </div>

      <USeparator class="mb-4" />

      <NuxtLink to="/checkout" class="w-full">
        <UButton label="Checkout" :disabled="cartStore.getTotalItems === 0" class="w-full" />
      </NuxtLink>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import CartContainer from '~/components/cart/CartContainer.vue'

const productStore = useProductStore()
const cartStore = useCartStore()

const randomProducts = computed(() => productStore.randomProducts)

onMounted(async () => {
  await productStore.fetchRandomProducts(8)
})
</script>
