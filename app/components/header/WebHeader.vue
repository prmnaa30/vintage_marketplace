<script setup lang="ts">
const user = useCurrentUser()
</script>

<template>
  <UHeader class="bg-white">
    <template #left>
      <NuxtLink to="/">
        <UiAppHorizontalLogo class="w-auto h-8 shrink-0" />
      </NuxtLink>
    </template>

    <HeaderSearchInput />

    <template #right>
      <HeaderAuthenticatedUserMenu v-if="user" />
      <HeaderUnauthenticatedUserMenu v-else />

      <div class="h-8 border border-gray-300/50 ml-2" />

      <HeaderLanguageMenu />
    </template>
  </UHeader>
</template>
