export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return
  }

  const { $api } = useNuxtApp()

  try {
    await $api('/auth/me')

    return navigateTo('/dashboard')
  } catch {
    return
  }
})
