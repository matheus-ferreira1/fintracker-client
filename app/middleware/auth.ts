export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    if (import.meta.client) {
      const toast = useToast()
      toast.add({
        title: 'Please login to continue',
        color: 'error'
      })
    }
    return navigateTo('/login')
  }
})
