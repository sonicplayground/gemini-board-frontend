<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span class="text-h5">차량 상세 정보</span>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              :to="`/vehicles/${id}/edit`"
            >
              수정
            </v-btn>
          </v-card-title>
          <v-card-text v-if="loading">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
          <v-card-text v-else-if="vehicle">
            <v-row>
              <v-col cols="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-title>차량명</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle.name }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>제조사</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle.manufacturer }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>모델</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle.model }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-title>연식</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle.year }}년</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>번호판</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle.licensePlate }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>등록일</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(vehicle.createdAt) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <v-alert
              type="error"
              text="차량 정보를 찾을 수 없습니다."
            ></v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
const loading = ref(false)
const vehicle = ref<any>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    loading.value = true
    // TODO: API 호출 구현
    await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 딜레이
    vehicle.value = {
      id: 1,
      name: '내 차량 1',
      manufacturer: '현대',
      model: '아반떼',
      year: 2020,
      licensePlate: '12가 3456',
      createdAt: '2024-03-20T00:00:00Z'
    }
  } catch (error: any) {
    console.error('차량 정보 조회 실패:', error)
    alert(error.message || '차량 정보를 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
})
</script> 