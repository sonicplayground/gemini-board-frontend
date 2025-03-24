<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-title>차량 관리 시스템</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!authStore.isAuthenticated"
        to="/auth/login"
        text
      >
        로그인
      </v-btn>
      <v-btn
        v-else
        @click="handleLogout"
        text
      >
        로그아웃
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>
