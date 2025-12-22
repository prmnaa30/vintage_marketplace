<template>
  <div class="flex gap-4 items-center justify-end w-45">
    <NuxtLink to="/login">
      <UButton
        variant="outline"
        label="Login"
        size="lg"
        class="cursor-pointer"
      />
    </NuxtLink>
    <NuxtLink to="/register">
      <UButton
        variant="solid"
        label="Sign Up"
        size="lg"
        class="cursor-pointer"
      />
    </NuxtLink>
  </div>
</template>
