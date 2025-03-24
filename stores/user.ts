import { defineStore } from 'pinia'
import { get, post, put, del } from '../utils/api'

interface User {
  id: string | number
  loginId: string
  name: string
  userType: string
  email?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }),

  actions: {
    // 사용자 목록 조회
    async fetchUsers() {
      try {
        this.loading = true
        this.error = null
        this.users = await get<User[]>('/users')
      } catch (error: any) {
        this.error = error.message || '사용자 목록을 불러오는데 실패했습니다.'
        console.error('사용자 목록 조회 실패:', error)
      } finally {
        this.loading = false
      }
    },

    // 특정 사용자 조회
    async fetchUser(id: string | number) {
      try {
        this.loading = true
        this.error = null
        this.currentUser = await get<User>(`/users/${id}`)
      } catch (error: any) {
        this.error = error.message || '사용자 정보를 불러오는데 실패했습니다.'
        console.error('사용자 정보 조회 실패:', error)
      } finally {
        this.loading = false
      }
    },

    // 사용자 생성
    async createUser(userData: Partial<User>) {
      try {
        this.loading = true
        this.error = null
        const newUser = await post<User>('/users', userData)
        this.users.push(newUser)
        return newUser
      } catch (error: any) {
        this.error = error.message || '사용자 생성에 실패했습니다.'
        console.error('사용자 생성 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 사용자 정보 수정
    async updateUser(id: string | number, userData: Partial<User>) {
      try {
        this.loading = true
        this.error = null
        const updatedUser = await put<User>(`/users/${id}`, userData)
        
        // 현재 사용자 데이터 업데이트
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = updatedUser
        }
        
        // 목록에서도 사용자 데이터 업데이트
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
        
        return updatedUser
      } catch (error: any) {
        this.error = error.message || '사용자 정보 수정에 실패했습니다.'
        console.error('사용자 정보 수정 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 사용자 삭제
    async deleteUser(id: string | number) {
      try {
        this.loading = true
        this.error = null
        await del(`/users/${id}`)
        
        // 목록에서 사용자 제거
        this.users = this.users.filter(user => user.id !== id)
        
        // 현재 사용자가 삭제된 사용자와 같다면 null로 설정
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = null
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || '사용자 삭제에 실패했습니다.'
        console.error('사용자 삭제 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 