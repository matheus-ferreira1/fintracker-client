import type { ApiResponse } from '~/types/api.types'
import type { LoginPayload, RegisterPayload } from '~/types/auth.types'
import type { User } from '~/types/user.types'

export function useAuth() {
  const { $api } = useNuxtApp()
  const toast = useToast()
  const route = useRoute()

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

      const redirectTo = (route.query.redirect as string) || '/dashboard'
      navigateTo(redirectTo)
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

      const redirectTo = (route.query.redirect as string) || '/dashboard'
      navigateTo(redirectTo)
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

  /**
   * Check if the user is currently authenticated
   * This method makes an API call to verify the session
   */
  async function checkAuth(): Promise<boolean> {
    try {
      await $api('/auth/me')
      return true
    } catch {
      return false
    }
  }

  /**
   * Get the current authenticated user
   * Returns null if not authenticated
   */
  async function getCurrentUser(): Promise<User | null> {
    try {
      const response = await $api<ApiResponse<User>>('/auth/me')
      return response.data
    } catch {
      return null
    }
  }

  return {
    pending: readonly(isLoading),
    register,
    login,
    logout,
    checkAuth,
    getCurrentUser
  }
}
