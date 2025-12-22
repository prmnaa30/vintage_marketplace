<template>
  <UModal
    :open="registerSuccess"
    class="w-90"
  >
    <template #content>
      <div class="px-4 py-3 flex flex-col items-center">
        <img
          src="~/assets/img/plane.gif"
          alt="Plane"
          width="150"
        >
        <div class="text-center my-4">
          <h1 class="font-semibold">
            Successfully Register
          </h1>
          <p class="text-neutral-500">
            Thank you for register at vintage. Start find your favorite pre-loved product here.
          </p>
        </div>

        <NuxtLink
          to="/"
          class="w-full"
        >
          <UButton
            label="Go to Home Page"
            size="xl"
            class="w-full cursor-pointer"
            :ui="{ base: 'w-full flex justify-center' }"
          />
        </NuxtLink>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps({
  registerSuccess: { type: Boolean, required: true }
})
</script>
