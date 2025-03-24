<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center text-h5 py-4">
            로그인
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="formData.loginId"
                label="아이디"
                :rules="[v => !!v || '아이디를 입력해주세요']"
                required
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="formData.password"
                label="비밀번호"
                type="password"
                :rules="[v => !!v || '비밀번호를 입력해주세요']"
                required
                class="mb-4"
                @keydown.enter="handleLogin"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn
              color="secondary"
              @click="goToSignup"
              variant="outlined"
            >
              회원가입
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleLogin"
              type="submit"
            >
              로그인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = ref()
const loading = ref(false)
const isFormValid = ref(false)

const formData = reactive({
  loginId: '',
  password: ''
})

const handleLogin = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    await authStore.login(formData.loginId, formData.password)
    router.push('/')
  } catch (error: any) {
    console.error('로그인 실패:', error)
    alert(error.message || '로그인에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

const goToSignup = () => {
  router.push('/auth/signup')
}
</script> 