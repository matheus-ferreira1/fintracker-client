export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  if (!authStore.isAuthenticated) {
    if (import.meta.client) {
      const toast = useToast()
      toast.add({
        title: 'Please login to continue',
        color: 'error'
      })
    }

    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }, { external: true })
  }
})
