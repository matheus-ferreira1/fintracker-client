export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  useNuxtApp()
  const toast = useToast()
  const { checkAuthAndGetUser } = useAuth()

  try {
    checkAuthAndGetUser()
  } catch (err) {
    toast.add({
      title: 'Please login to continue',
      description: parseApiError(err),
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
