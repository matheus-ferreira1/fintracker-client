import type { LoginPayload, RegisterPayload } from '~/types/auth.types'

export function useAuth() {
  const { $api } = useNuxtApp()
  const toast = useToast()

  const isLoading = shallowRef(false)

  async function register(payload: RegisterPayload) {
    isLoading.value = true
    try {
      await $api('/auth/register', {
        method: 'POST',
        body: payload
      })
      toast.add({
        title: 'Account created successfully!'
      })
      navigateTo('/dashboard')
    } catch (err) {
      console.log(err)
      toast.add({
        title: 'Something went wrong',
        description: parseApiError(err),
        color: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  async function login(payload: LoginPayload) {
    isLoading.value = true
    try {
      await $api('/auth/login', {
        method: 'POST',
        body: payload
      })
      toast.add({
        title: 'Login successful!'
      })
      navigateTo('/dashboard')
    } catch (err) {
      console.log(err)
      toast.add({
        title: 'Something went wrong',
        description: parseApiError(err),
        color: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await $api('/auth/logout', {
        method: 'POST'
      })
      toast.add({
        title: 'Logout successful!'
      })
      navigateTo('/login')
    } catch (err) {
      console.log(err)
      toast.add({
        title: 'Something went wrong',
        description: parseApiError(err),
        color: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    pending: readonly(isLoading),
    register,
    login,
    logout
  }
}
