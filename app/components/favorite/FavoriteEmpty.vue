<template>
  <div class="w-full flex flex-col justify-center items-center my-8">
    <img :src="folderFavorite" alt="Favorite not found" />

    <h1 class="font-bold text-2xl mt-2">
      Your favorites is still empty
    </h1>
    <p class="mb-2">
      Find your favorite items and add to favorites.
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
import folderFavorite from '~/assets/img/folder-favorite.svg'
</script>
