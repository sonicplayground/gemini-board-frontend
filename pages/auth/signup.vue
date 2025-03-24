<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center text-h5 py-4">
            회원가입
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleSignup">
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
                @keydown.enter="handleSignup"
              ></v-text-field>

              <v-text-field
                v-model="formData.passwordConfirm"
                label="비밀번호 확인"
                type="password"
                :rules="[
                  v => !!v || '비밀번호 확인을 입력해주세요',
                  v => v === formData.password || '비밀번호가 일치하지 않습니다'
                ]"
                required
                class="mb-4"
                @keydown.enter="handleSignup"
              ></v-text-field>

              <v-text-field
                v-model="formData.name"
                label="이름"
                :rules="[v => !!v || '이름을 입력해주세요']"
                required
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="formData.nickname"
                label="닉네임"
                class="mb-4"
              ></v-text-field>

              <v-select
                v-model="formData.gender"
                label="성별"
                :items="['MALE', 'FEMALE', 'ETC']"
                :rules="[v => !!v || '성별을 선택해주세요']"
                required
                class="mb-4"
              ></v-select>

              <v-text-field
                v-model="formattedBirthDate"
                label="생년월일"
                type="datetime-local"
                :rules="[v => !!v || '생년월일을 입력해주세요']"
                required
                class="mb-4"
                @update:model-value="handleBirthChange"
              ></v-text-field>

              <v-text-field
                v-model="formData.address"
                label="주소"
                class="mb-4"
              ></v-text-field>

              <v-select
                v-model="formData.userType"
                label="사용자 유형"
                :items="['SERVICE_USER', 'SERVICE_ADMIN']"
                :rules="[v => !!v || '사용자 유형을 선택해주세요']"
                required
                class="mb-4"
              ></v-select>

              <v-text-field
                v-model="formData.profilePicture"
                label="프로필 사진 URL"
                class="mb-4"
                hint="프로필 사진 URL을 입력하세요 (선택사항)"
                persistent-hint
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn
              color="secondary"
              @click="goToLogin"
              variant="outlined"
            >
              로그인으로 돌아가기
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleSignup"
              type="submit"
            >
              회원가입
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = ref()
const loading = ref(false)
const isFormValid = ref(false)

const formData = reactive({
  loginId: '',
  password: '',
  passwordConfirm: '',
  name: '',
  nickname: '',
  gender: '',
  birth: '',
  address: '',
  userType: 'SERVICE_USER',
  profilePicture: ''
})

// 생년월일 포맷팅
const formattedBirthDate = computed({
  get: () => {
    if (!formData.birth) return ''
    return formData.birth.replace(' ', 'T').concat(':00')
  },
  set: (value) => {
    if (!value) return
    formData.birth = value.replace('T', ' ').concat(':00')
  }
})

const handleBirthChange = (value: string) => {
  if (!value) return
  formData.birth = value.replace('T', ' ').concat(':00')
}

const handleSignup = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    await authStore.signup(formData)
    alert('회원가입이 완료되었습니다.')
    router.push('/auth/login')
  } catch (error: any) {
    console.error('회원가입 실패:', error)
    alert(error.message || '회원가입에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script> 