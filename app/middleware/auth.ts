export default defineNuxtRouteMiddleware((_to, _from) => {
  const user = useCurrentUser()

  if (!user.value) {
    // Redirect ke halaman login jika pengguna tidak login
    return navigateTo('/login')
  }
})
