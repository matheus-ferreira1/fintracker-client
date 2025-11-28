export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()
  const toast = useToast()

  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  if (authStore.isAuthenticated) {
    toast.add({
      title: 'Welcome back!'
    })
    return navigateTo('/dashboard')
  }
})
