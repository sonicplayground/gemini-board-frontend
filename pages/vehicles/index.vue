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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle'

const router = useRouter()
const vehicleStore = useVehicleStore()
const loading = ref(false)
const vehicles = ref([])

const headers = [
  { title: '차량명', key: 'name' },
  { title: '제조사', key: 'manufacturer' },
  { title: '모델', key: 'model' },
  { title: '연식', key: 'year' },
  { title: '번호판', key: 'licensePlate' },
  { title: '관리', key: 'actions', sortable: false }
]

const viewVehicle = (item: any) => {
  router.push(`/vehicles/${item.id}`)
}

const editVehicle = (item: any) => {
  router.push(`/vehicles/${item.id}/edit`)
}

const deleteVehicle = async (item: any) => {
  if (!confirm('정말로 이 차량을 삭제하시겠습니까?')) return

  try {
    loading.value = true
    await vehicleStore.deleteVehicle(item.id)
    vehicles.value = vehicles.value.filter(v => v.id !== item.id)
  } catch (error: any) {
    console.error('차량 삭제 실패:', error)
    alert(error.message || '차량 삭제에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

const fetchVehicles = async () => {
  try {
    loading.value = true
    vehicles.value = await vehicleStore.fetchVehicles()
  } catch (error: any) {
    console.error('차량 목록 조회 실패:', error)
    alert(error.message || '차량 목록을 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVehicles()
})
</script> 