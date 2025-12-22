export default defineNuxtPlugin(() => {
  const favoritesStore = useFavoritesStore()
  const user = useCurrentUser()

  watch(user, async (newUser) => {
    if (newUser) {
      await favoritesStore.fetchFavorites()
    } else {
      favoritesStore.favoriteItems = []
    }
  }, { immediate: true })
})
