export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (loggedIn.value) {
    if (import.meta.client) {
      const toast = useToast()
      toast.add({
        title: 'Welcome back!'
      })
    }
    return navigateTo('/dashboard')
  }
})
