export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
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
