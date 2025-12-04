export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  if (authStore.isAuthenticated) {
    if (import.meta.client) {
      const toast = useToast()
      toast.add({
        title: 'Welcome back!'
      })
    }
    return navigateTo('/dashboard')
  }
})
