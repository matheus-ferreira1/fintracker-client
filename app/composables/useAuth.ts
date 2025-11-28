import type { ApiResponse } from '~/types/api.types'
import type { LoginPayload, RegisterPayload } from '~/types/auth.types'
import type { User } from '~/types/user.types'

export function useAuth() {
  const { $api } = useNuxtApp()
  const toast = useToast()

  const isLoading = shallowRef(false)
  const user = useState<User | null>('user', () => null)

  function setUser(userData: User | null) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  const userInitials = computed(() => {
    if (!user.value?.name) return ''

    const names = user.value.name.trim().split(' ').filter(Boolean)
    if (names.length === 0) return ''

    if (names.length === 1) {
      const firstName = names[0]
      return firstName ? firstName.charAt(0).toUpperCase() : ''
    }

    const firstName = names[0]
    const lastName = names[names.length - 1]
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
    return `${firstInitial}${lastInitial}`
  })

  async function register(payload: RegisterPayload) {
    isLoading.value = true
    try {
      const { data } = await $api<ApiResponse<User>>('/auth/register', {
        method: 'POST',
        body: payload
      })

      if (data) {
        setUser(data)
      }

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
      const { data } = await $api<ApiResponse<User>>('/auth/login', {
        method: 'POST',
        body: payload
      })

      if (data) {
        setUser(data)
      }

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

      clearUser()

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

  async function checkAuthAndGetUser(): Promise<boolean> {
    isLoading.value = true
    try {
      const { data } = await $api<ApiResponse<User>>('/auth/me')

      if (data) setUser(data)

      return !!data
    } catch {
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    pending: readonly(isLoading),
    user,
    userInitials,
    register,
    login,
    logout,
    checkAuthAndGetUser
  }
}
