<template>
  <section>
    <div class="flex justify-between">
      <h1 class="text-lg font-bold">
        Cart
      </h1>

      <UBadge
        variant="outline"
        color="neutral"
      >
        <span v-if="cartStore.getTotalItems > 0">
          {{ cartStore.getTotalItems }} Items
        </span>
        <span v-else>
          You don't have any item yet
        </span>
      </UBadge>
    </div>

    <USeparator class="py-4" />

    <div v-if="cartItems.length > 0">
      <CartItem
        v-for="item in cartItems"
        :key="item.productId"
        :item="item"
      />
    </div>

    <CartEmpty v-else />
  </section>
</template>

<script setup lang="ts">
import CartItem from './CartItem.vue'

const cartStore = useCartStore()

const cartItems = computed(() => cartStore.items)
</script>
