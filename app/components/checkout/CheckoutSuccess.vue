<template>
  <UModal :open="isOpen" @close="closeModal">
    <template #content>
      <section class="p-6 flex flex-col items-center text-center">
        <img :src="checkoutSuccess" alt="Success" class="w-32 h-32 mb-4">

        <h1 class="text-xl font-bold mb-2">
          Order #ORD-89123-823 placed successfully
        </h1>

        <p class="mb-6">
          Thank you for do online shopping at Vintage. You can track and see your order on transaction history menu.
        </p>

        <div class="flex gap-2 w-full">
          <NuxtLink to="/" class="w-full">
            <UButton
              label="Continue Shopping"
              class="w-full"
              @click="closeModal"
            />
          </NuxtLink>
          <NuxtLink to="/profile" class="w-full">
            <UButton
              label="Go to history transaction"
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
import checkoutSuccess from '~/assets/img/checkout-success.gif'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>
