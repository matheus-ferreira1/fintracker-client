import type { ApiResponse } from '~/types/api.types'
import type { LoginPayload, RegisterPayload } from '~/types/auth.types'
import type { User } from '~/types/user.types'

export function useAuth() {
  const { $api } = useNuxtApp()
  const toast = useToast()

  const isLoading = shallowRef(false)

  async function register(payload: RegisterPayload) {
    isLoading.value = true
    try {
      await $api<ApiResponse<User>>('/auth/register', {
        method: 'POST',
        body: payload
      })
      toast.add({
        title: 'Account created successfully!'
      })
      navigateTo('/dashboard')
    } catch (err) {
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
      await $api<ApiResponse<User>>('/auth/login', {
        method: 'POST',
        body: payload
      })
      toast.add({
        title: 'Login successful!'
      })
      navigateTo('/dashboard')
    } catch (err) {
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
