<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-btn
              icon
              class="mr-2"
              @click="router.push('/vehicles')"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            차량 등록
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
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
                    v-model="formData.vin"
                    label="차대번호"
                    :rules="[v => !!v || '차대번호를 입력해주세요']"
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
                    v-model="formData.modelName"
                    label="모델명"
                    :rules="[v => !!v || '모델명을 입력해주세요']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.purchaseYear"
                    label="구매년도"
                    type="number"
                    :rules="[
                      v => !!v || '구매년도를 입력해주세요',
                      v => v >= 1800 || '구매년도는 1800년 이상이어야 합니다'
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.mileage"
                    label="주행거리"
                    type="number"
                    :rules="[
                      v => !!v || '주행거리를 입력해주세요',
                      v => v >= 0 || '주행거리는 0 이상이어야 합니다'
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.vehiclePicture"
                    label="차량 사진 URL"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.registrationPicture"
                    label="등록증 사진 URL"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.memo"
                    label="메모"
                    rows="3"
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row class="mt-4">
                <v-col cols="12">
                  <v-btn
                    color="primary"
                    :loading="loading"
                    :disabled="!valid"
                    @click="handleSubmit"
                  >
                    등록
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '../../utils/api'

const router = useRouter()
const form = ref()
const valid = ref(false)
const loading = ref(false)

const formData = ref({
  name: '',
  vin: '',
  manufacturer: '',
  modelName: '',
  purchaseYear: new Date().getFullYear(),
  mileage: 0,
  vehiclePicture: '',
  registrationPicture: '',
  memo: '',
  status: {
    mileage: '0',
    engineOilChangeDate: `${new Date().getFullYear()}-01-01`,
    brakePadReplacementDate: `${new Date().getFullYear()}-01-01`,
    tireForeRightReplacementDate: `${new Date().getFullYear()}-01-01`,
    tireForeLeftReplacementDate: `${new Date().getFullYear()}-01-01`,
    tireBackRightReplacementDate: `${new Date().getFullYear()}-01-01`,
    tireBackLeftReplacementDate: `${new Date().getFullYear()}-01-01`
  }
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    loading.value = true
    const response = await post('/api/v1/vehicles', formData.value)
    router.push(`/vehicles/${response.vehicleKey}`)
  } catch (error) {
    console.error('차량 등록 실패:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card-title {
  font-size: 1.5rem;
  font-weight: 500;
}
</style> 