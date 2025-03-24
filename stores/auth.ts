import { defineStore } from 'pinia'
import { post } from '../utils/api'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: {
    loginId: string
    name: string
    userType: string
  } | null
}

// 브라우저 환경인지 확인하는 함수
const isBrowser = () => typeof window !== 'undefined'

// localStorage에 안전하게 접근하는 함수
const getLocalStorageItem = (key: string) => {
  if (isBrowser()) {
    return localStorage.getItem(key)
  }
  return null
}

// localStorage에 안전하게 저장하는 함수
const setLocalStorageItem = (key: string, value: string) => {
  if (isBrowser()) {
    localStorage.setItem(key, value)
  }
}

// localStorage에서 안전하게 삭제하는 함수
const removeLocalStorageItem = (key: string) => {
  if (isBrowser()) {
    localStorage.removeItem(key)
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    token: getLocalStorageItem('auth_token'),
    user: isBrowser() ? JSON.parse(getLocalStorageItem('auth_user') || 'null') : null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user
  },

  actions: {
    async login(loginId: string, password: string) {
      try {
        const response = await post('/login/sign-in', { loginId, password })
        this.token = response.token
        this.isAuthenticated = true
        localStorage.setItem('token', response.token)
        return true
      } catch (error: any) {
        console.error('로그인 실패:', error)
        throw new Error(error.message || '로그인에 실패했습니다.')
      }
    },

    async signup(userData: any) {
      try {
        const response = await post('/login/sign-up', userData)
        return response
      } catch (error: any) {
        console.error('회원가입 실패:', error)
        throw new Error(error.message || '회원가입에 실패했습니다.')
      }
    },

    logout() {
      this.token = null
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('token')
    },

    initAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
      }
    },

    // 토큰 유효성 확인 (선택적)
    async validateToken() {
      if (!this.token) return false
      
      try {
        // 백엔드에 토큰 유효성 검증 요청
        // 실제 백엔드 API가 있다면 여기서 토큰 검증 API 호출
        return true
      } catch (error) {
        console.error('토큰 검증 실패:', error)
        this.logout()
        return false
      }
    }
  }
}) 