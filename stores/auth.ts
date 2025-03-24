import { defineStore } from 'pinia'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: {
    loginId: string
    name: string
    userType: string
  } | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    token: null,
    user: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user
  },

  actions: {
    async login(loginId: string, password: string) {
      try {
        const response = await fetch('/api/v1/login/sign-in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ loginId, password })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '로그인에 실패했습니다.')
        }

        const data = await response.json()
        this.token = data.token
        this.isAuthenticated = true
        this.user = {
          loginId,
          name: '', // 서버에서 사용자 정보를 받아와야 함
          userType: '' // 서버에서 사용자 정보를 받아와야 함
        }
      } catch (error: any) {
        console.error('로그인 실패:', error)
        throw error
      }
    },

    async logout() {
      this.token = null
      this.isAuthenticated = false
      this.user = null
    }
  }
}) 