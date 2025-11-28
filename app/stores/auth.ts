import { defineStore } from 'pinia'
import type { ApiResponse } from '~/types/api.types'
import type { LoginPayload, RegisterPayload } from '~/types/auth.types'
import type { User } from '~/types/user.types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    isInitialized: false
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,

    userInitials: (state): string => {
      if (!state.user?.name) return ''

      const names = state.user.name.trim().split(' ').filter(Boolean)
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
    },

    currentUser: (state): User | null => state.user,

    pending: (state): boolean => state.isLoading
  },

  actions: {
    setUser(userData: User | null) {
      this.user = userData
    },

    clearUser() {
      this.user = null
    },

    async initialize() {
      if (this.isInitialized) {
        return
      }

      this.isLoading = true
      try {
        const { $api } = useNuxtApp()
        const { data } = await $api<ApiResponse<User>>('/auth/me')

        if (data) {
          this.setUser(data)
        }
      } catch {
        this.clearUser()
      } finally {
        this.isLoading = false
        this.isInitialized = true
      }
    },

    async register(payload: RegisterPayload) {
      this.isLoading = true
      const toast = useToast()

      try {
        const { $api } = useNuxtApp()
        const { data } = await $api<ApiResponse<User>>('/auth/register', {
          method: 'POST',
          body: payload
        })

        if (data) {
          this.setUser(data)
        }

        toast.add({
          title: 'Welcome!',
          description: 'Account created successfully!'
        })

        await navigateTo('/dashboard')
      } catch (err) {
        toast.add({
          title: 'Something went wrong',
          description: parseApiError(err),
          color: 'error'
        })
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async login(payload: LoginPayload) {
      this.isLoading = true
      const toast = useToast()

      try {
        const { $api } = useNuxtApp()
        const { data } = await $api<ApiResponse<User>>('/auth/login', {
          method: 'POST',
          body: payload
        })

        if (data) {
          this.setUser(data)
        }

        toast.add({
          title: 'Login successful!'
        })

        await navigateTo('/dashboard')
      } catch (err) {
        toast.add({
          title: 'Something went wrong',
          description: parseApiError(err),
          color: 'error'
        })
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      const toast = useToast()

      try {
        const { $api } = useNuxtApp()
        await $api('/auth/logout', {
          method: 'POST'
        })

        this.clearUser()

        toast.add({
          title: 'Logout successful!'
        })

        await navigateTo('/login')
      } catch (err) {
        toast.add({
          title: 'Something went wrong',
          description: parseApiError(err),
          color: 'error'
        })
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async checkAuth(): Promise<boolean> {
      if (this.isInitialized) {
        return this.isAuthenticated
      }

      await this.initialize()
      return this.isAuthenticated
    }
  }
})
