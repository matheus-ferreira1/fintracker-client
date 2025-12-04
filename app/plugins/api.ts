export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    onRequest({ options }) {
      if (import.meta.server) {
        const { cookie } = useRequestHeaders(['cookie'])

        if (cookie) {
          options.headers.set('cookie', cookie)
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        const authStore = useAuthStore()
        authStore.clearUser()

        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }

      throw response
    }
  })

  return {
    provide: {
      api
    }
  }
})
