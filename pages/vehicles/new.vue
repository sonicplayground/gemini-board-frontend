<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="text-h5">차량 등록</span>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="isFormValid"
              @submit.prevent="handleSubmit"
            >
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.name"
                    label="차량명"
                    :rules="[v => !!v || '차량명을 입력해주세요']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.manufacturer"
                    label="제조사"
                    :rules="[v => !!v || '제조사를 입력해주세요']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.model"
                    label="모델"
                    :rules="[v => !!v || '모델을 입력해주세요']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.year"
                    label="연식"
                    type="number"
                    :rules="[
                      v => !!v || '연식을 입력해주세요',
                      v => v >= 1900 && v <= new Date().getFullYear() || '올바른 연식을 입력해주세요'
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.licensePlate"
                    label="번호판"
                    :rules="[v => !!v || '번호판을 입력해주세요']"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="goBack"
            >
              취소
            </v-btn>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleSubmit"
            >
              등록
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref<any>(null)
const loading = ref(false)
const isFormValid = ref(false)

const formData = ref({
  name: '',
  manufacturer: '',
  model: '',
  year: '',
  licensePlate: ''
})

const goBack = () => {
  router.back()
}

const handleSubmit = async () => {
  if (!form.value.validate()) return

  try {
    loading.value = true
    // TODO: API 호출 구현
    await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 딜레이
    router.push('/vehicles')
  } catch (error: any) {
    console.error('차량 등록 실패:', error)
    alert(error.message || '차량 등록에 실패했습니다.')
  } finally {
    loading.value = false
  }
}
</script> 