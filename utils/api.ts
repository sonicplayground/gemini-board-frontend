import { useAuthStore } from '../stores/auth'

// API 기본 URL
const API_BASE_URL = 'http://localhost:8080/api/v1'

// 브라우저 환경인지 확인하는 함수
const isBrowser = () => typeof window !== 'undefined'

// API 요청을 위한 기본 헤더와 옵션을 설정하는 함수
export const createFetchOptions = (options: RequestInit = {}): RequestInit => {
  const headers = new Headers(options.headers || {})
  
  // Content-Type 설정 (기본값 지정)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  
  // Accept 헤더 설정
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }
  
  // 브라우저 환경에서만 인증 토큰 추가
  if (isBrowser()) {
    const authStore = useAuthStore()
    // 인증 토큰이 있으면 Authorization 헤더에 추가
    if (authStore.token) {
      headers.set('Authorization', `Bearer ${authStore.token}`)
    }
  }
  
  return {
    ...options,
    headers,
    credentials: 'include'
  }
}

// GET 요청
export const get = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, createFetchOptions({
    ...options,
    method: 'GET'
  }))
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `요청 실패: ${response.status}`)
  }
  
  return response.json()
}

// POST 요청
export const post = async <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, createFetchOptions({
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  }))
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `요청 실패: ${response.status}`)
  }
  
  return response.json()
}

// PUT 요청
export const put = async <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, createFetchOptions({
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  }))
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `요청 실패: ${response.status}`)
  }
  
  return response.json()
}

// DELETE 요청
export const del = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, createFetchOptions({
    ...options,
    method: 'DELETE'
  }))
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `요청 실패: ${response.status}`)
  }
  
  return response.json()
} 