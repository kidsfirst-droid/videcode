import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { name: string; role: string } | null,
    isLoggedIn: false,
  }),
  actions: {
    login(name: string) {
      this.user = { name, role: 'Admin' }
      this.isLoggedIn = true
      // In a real app, we'd use a cookie or local storage
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(this.user))
      }
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      if (process.client) {
        localStorage.removeItem('auth_user')
      }
      useRouter().push('/login')
    },
    initAuth() {
      if (process.client) {
        const savedUser = localStorage.getItem('auth_user')
        if (savedUser) {
          this.user = JSON.parse(savedUser)
          this.isLoggedIn = true
        }
      }
    }
  }
})
