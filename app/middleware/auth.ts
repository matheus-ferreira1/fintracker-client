export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()
  const toast = useToast()

  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  if (!authStore.isAuthenticated) {
    toast.add({
      title: 'Please login to continue',
      color: 'error'
    })

    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }, { external: true })
  }
})
