export function useAuth() {
  const authStore = useAuthStore()

  return {
    user: computed(() => authStore.currentUser),
    pending: computed(() => authStore.pending),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isInitialized: computed(() => authStore.isInitialized),

    userInitials: computed(() => authStore.userInitials),

    register: (payload: RegisterPayload) => authStore.register(payload),
    login: (payload: LoginPayload) => authStore.login(payload),
    logout: () => authStore.logout(),
    checkAuth: () => authStore.checkAuth(),
    initialize: () => authStore.initialize()
  }
}
