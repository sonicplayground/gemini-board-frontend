import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(nuxtApp => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
  
  // auth 스토어의 초기화 메서드 호출
  const authStore = useAuthStore()
  authStore.initAuth()
  
  return {
    provide: {
      pinia
    }
  }
}) 