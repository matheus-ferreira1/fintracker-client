export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const { $api } = useNuxtApp()
  const toast = useToast()

  try {
    await $api('/auth/me')
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
