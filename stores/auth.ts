import { defineStore } from 'pinia'
import { post } from '@/utils/api'

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
    token: localStorage.getItem('auth_token'),
    user: JSON.parse(localStorage.getItem('auth_user') || 'null')
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user
  },

  actions: {
    async login(loginId: string, password: string) {
      try {
        // 직접 fetch 사용 - utils/api 메서드는 인증 토큰 관련 로직을 포함하고 있어서
        // 로그인 시에는 직접 fetch를 사용합니다.
        const response = await fetch('http://localhost:8080/api/v1/login/sign-in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ loginId, password })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || '로그인에 실패했습니다.')
        }

        const data = await response.json()
        
        // 토큰 저장
        this.token = data.token
        this.isAuthenticated = true
        
        // 사용자 정보 저장
        this.user = {
          loginId: data.loginId || loginId,
          name: data.name || '',
          userType: data.userType || ''
        }
        
        // 로컬 스토리지에도 저장
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        
        return data
      } catch (error: any) {
        console.error('로그인 실패:', error)
        throw error
      }
    },

    async logout() {
      try {
        // 로그아웃 API 호출은 선택적입니다
        // await post('/logout', {})
        
        // 상태 초기화
        this.token = null
        this.isAuthenticated = false
        this.user = null
        
        // 로컬 스토리지에서 제거
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      } catch (error) {
        console.error('로그아웃 실패:', error)
      }
    },
    
    // 앱 초기화시 인증 상태 복원
    initAuth() {
      const token = localStorage.getItem('auth_token')
      const user = JSON.parse(localStorage.getItem('auth_user') || 'null')
      
      if (token && user) {
        this.token = token
        this.user = user
        this.isAuthenticated = true
      }
    }
  }
}) 