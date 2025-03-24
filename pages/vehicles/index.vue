<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span class="text-h5">차량 목록</span>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              to="/vehicles/new"
            >
              차량 등록
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="vehicles"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.status.mileage="{ item }">
                {{ item.status?.mileage || '-' }} km
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  size="small"
                  color="primary"
                  @click="viewVehicle(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  color="warning"
                  @click="editVehicle(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  color="error"
                  @click="deleteVehicle(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
            
            <!-- 페이지네이션 -->
            <div class="d-flex justify-center mt-4">
              <v-pagination
                v-if="vehicleStore.pagination.totalPages > 1"
                v-model="currentPage"
                :length="vehicleStore.pagination.totalPages"
                @update:model-value="changePage"
              ></v-pagination>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicleStore } from '../../stores/vehicle'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const vehicleStore = useVehicleStore()
const authStore = useAuthStore()
const loading = ref(false)
const currentPage = ref(1)

// 차량 스토어에서 차량 목록 가져오기
const vehicles = computed(() => vehicleStore.vehicles)

const headers = [
  { title: '차량명', key: 'name' },
  { title: '제조사', key: 'manufacturer' },
  { title: '모델', key: 'modelName' },
  { title: '연식', key: 'purchaseYear' },
  { title: '주행거리', key: 'status.mileage' },
  { title: '관리', key: 'actions', sortable: false }
]

const viewVehicle = (item: any) => {
  router.push(`/vehicles/${item.vehicleKey}`)
}

const editVehicle = (item: any) => {
  router.push(`/vehicles/${item.vehicleKey}/edit`)
}

const deleteVehicle = async (item: any) => {
  if (!confirm('정말로 이 차량을 삭제하시겠습니까?')) return

  try {
    loading.value = true
    await vehicleStore.deleteVehicle(item.vehicleKey)
  } catch (error: any) {
    console.error('차량 삭제 실패:', error)
    alert(error.message || '차량 삭제에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

const fetchVehicles = async (page = 0) => {
  try {
    // 인증되지 않은 상태면 로그인 페이지로 리다이렉트
    if (!authStore.isAuthenticated && !authStore.token) {
      router.push('/auth/login')
      return
    }
    
    loading.value = true
    await vehicleStore.fetchVehicles(page)
  } catch (error: any) {
    console.error('차량 목록 조회 실패:', error)
    
    // 401 또는 403 에러인 경우 로그인 페이지로 리다이렉트
    if (error.status === 401 || error.status === 403) {
      alert('인증이 필요합니다. 다시 로그인해주세요.')
      await authStore.logout()
      router.push('/auth/login')
    } else {
      alert(error.message || '차량 목록을 불러오는데 실패했습니다.')
    }
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  // Vuetify의 페이지네이션은 1부터 시작하지만, API는 0부터 시작하므로 변환
  fetchVehicles(page - 1)
}

onMounted(async () => {
  // 인증 상태 초기화 후 데이터 로드
  authStore.initAuth()
  
  // 인증 상태가 변경되면 차량 목록 로드
  if (authStore.isAuthenticated) {
    fetchVehicles()
  } else if (authStore.token) {
    // 토큰은 있지만 인증 상태가 아직 완료되지 않은 경우
    authStore.isAuthenticated = true
    fetchVehicles()
  } else {
    router.push('/auth/login')
  }
})

// authStore의 인증 상태 변화를 감시
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    fetchVehicles()
  }
})
</script> 