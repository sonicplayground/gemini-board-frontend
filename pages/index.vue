<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4">차량 관리 시스템</h1>
        <p class="text-body-1 mb-4">차량 정보를 등록하고 관리하세요.</p>
        <v-btn
          v-if="!authStore.isAuthenticated"
          color="primary"
          to="/auth/login"
        >
          시작하기
        </v-btn>
        <v-btn
          v-else
          color="primary"
          to="/vehicles"
        >
          내 차량 관리하기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script> 