export default defineNuxtRouteMiddleware((_to, _from) => {
  const user = useCurrentUser()

  if (!user.value) {
    return navigateTo('/login')
  }
})
