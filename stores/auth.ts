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
        if (isBrowser()) {
          setLocalStorageItem('auth_token', data.token)
          setLocalStorageItem('auth_user', JSON.stringify(this.user))
        }
        
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
        if (isBrowser()) {
          removeLocalStorageItem('auth_token')
          removeLocalStorageItem('auth_user')
        }
      } catch (error) {
        console.error('로그아웃 실패:', error)
      }
    },
    
    // 앱 초기화시 인증 상태 복원
    initAuth() {
      if (isBrowser()) {
        const token = getLocalStorageItem('auth_token')
        const user = JSON.parse(getLocalStorageItem('auth_user') || 'null')
        
        if (token) {
          this.token = token
          if (user) {
            this.user = user
          }
          this.isAuthenticated = true
          console.log('인증 상태 복원 완료')
          return true
        }
      }
      return false
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