<template>
  <UModal :open="isOpen" @close="closeModal">
    <template #content>
      <section class="p-6 flex flex-col items-center text-center">
        <img :src="cartSuccess" alt="Success" class="w-32 h-32 mb-4">

        <h1 class="text-xl font-bold mb-2">
          Product successfully added to cart
        </h1>

        <p class="mb-6">
          "{{ productName }}" successfully added to cart. Check now on the cart or continue shopping.
        </p>

        <div class="flex gap-2 w-full">
          <UButton
            label="Continue Shopping"
            class="flex-1"
            @click="closeModal"
          />
          <NuxtLink to="/cart" class="w-full">
            <UButton
              label="Go to cart"
              class="w-full"
              @click="closeModal"
            />
          </NuxtLink>
        </div>
      </section>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import cartSuccess from '~/assets/img/cart-success.gif'

defineProps<{
  isOpen: boolean
  productName: string
}>()

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>
