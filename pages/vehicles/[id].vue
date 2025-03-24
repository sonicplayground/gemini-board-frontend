<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              @click="router.back()"
              class="mr-2"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            차량 상세 정보
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicle.name"
                  label="차량명"
                  readonly
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicle.manufacturer"
                  label="제조사"
                  readonly
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicle.modelName"
                  label="모델명"
                  readonly
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicle.vin"
                  label="차대번호"
                  readonly
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicle.purchaseYear"
                  label="구매년도"
                  readonly
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicle.vehiclePicture"
                  label="차량 사진 URL"
                  readonly
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicle.registrationPicture"
                  label="등록증 사진 URL"
                  readonly
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="vehicle.memo"
                  label="메모"
                  readonly
                  class="mb-4"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-4">
                  <v-card-title>차량 상태</v-card-title>
                  <v-card-text>
                    <VehicleStatus :vehicle="vehicle" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              @click="handleDelete"
              :loading="loading"
            >
              삭제
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { get, del } from '../../utils/api'
import VehicleStatus from '../../components/VehicleStatus.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const vehicle = ref({
  vehicleKey: '',
  name: '',
  vehiclePicture: '',
  vin: '',
  manufacturer: '',
  status: {},
  modelName: '',
  purchaseYear: '',
  registrationPicture: '',
  memo: '',
  ownerUserKey: ''
})

const fetchVehicle = async () => {
  try {
    loading.value = true
    const response = await get(`/vehicles/${route.params.id}`)
    vehicle.value = response
  } catch (error: any) {
    console.error('차량 정보 조회 실패:', error)
    alert(error.message || '차량 정보를 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('정말로 이 차량을 삭제하시겠습니까?')) return

  try {
    loading.value = true
    await del(`/vehicles/${route.params.id}`)
    alert('차량이 삭제되었습니다.')
    router.push('/vehicles')
  } catch (error: any) {
    console.error('차량 삭제 실패:', error)
    alert(error.message || '차량 삭제에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVehicle()
})
</script> 