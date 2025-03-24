<template>
  <div>
    <!-- 타이어 상태 (상단으로 이동) -->
    <v-card class="mb-6">
      <v-card-title>타이어 상태</v-card-title>
      <v-card-text>
        <div class="tire-status-container">
          <div class="tire-grid">
            <div class="tire-position">
              <div class="tire-date" :class="getTireColor('tireForeLeftReplacementDate')">
                {{ formatDate(getTireDate('tireForeLeftReplacementDate')) }}
              </div>
              <div class="tire-icon">🛞</div>
            </div>
            <div class="tire-position">
              <div class="tire-date" :class="getTireColor('tireForeRightReplacementDate')">
                {{ formatDate(getTireDate('tireForeRightReplacementDate')) }}
              </div>
              <div class="tire-icon">🛞</div>
            </div>
            <div class="tire-position">
              <div class="tire-date" :class="getTireColor('tireBackLeftReplacementDate')">
                {{ formatDate(getTireDate('tireBackLeftReplacementDate')) }}
              </div>
              <div class="tire-icon">🛞</div>
            </div>
            <div class="tire-position">
              <div class="tire-date" :class="getTireColor('tireBackRightReplacementDate')">
                {{ formatDate(getTireDate('tireBackRightReplacementDate')) }}
              </div>
              <div class="tire-icon">🛞</div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-btn
      color="primary"
      @click="showDetails = !showDetails"
      class="mb-4"
    >
      {{ showDetails ? '상세보기 접기' : '상세보기 펼치기' }}
    </v-btn>

    <div v-if="showDetails">
      <!-- 타임라인 그래프 -->
      <v-card>
        <v-card-title>차량 상태 타임라인</v-card-title>
        <v-card-text>
          <div class="timeline-container">
            <div class="timeline-events">
              <div v-for="event in timelineEvents" :key="event.id"
                   class="timeline-event"
                   :style="{ 
                     left: `${event.position}%`,
                     top: `${event.verticalPosition}%`
                   }">
                <div class="event-content">
                  <div class="event-label">{{ event.label }}</div>
                  <div class="event-date">{{ formatDate(event.date) }}</div>
                </div>
              </div>
            </div>
            <div class="timeline-line"></div>
            <div class="timeline-years">
              <div v-for="year in timelineYears" :key="year"
                   class="year-marker"
                   :style="{ left: `${getYearPosition(year)}%` }">
                {{ year }}
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 상태 텍스트 목록 -->
      <v-card class="mt-6">
        <v-card-title>상태 상세 정보</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-table>
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>값</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in vehicle.status" :key="key">
                    <td>{{ key }}</td>
                    <td>
                      <v-text-field
                        v-if="key === 'mileage'"
                        :value="value || '0'"
                        readonly
                        type="number"
                        density="compact"
                        hide-details
                        class="ma-0 pa-0"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        :value="value || defaultDate"
                        readonly
                        type="date"
                        density="compact"
                        hide-details
                        class="ma-0 pa-0"
                      ></v-text-field>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  vehicle: {
    purchaseYear: string
    status: Record<string, string>
  }
}>()

const showDetails = ref(false)

// 기본 날짜 계산 (구매년도 1월 1일)
const defaultDate = computed(() => {
  return `${props.vehicle.purchaseYear}-01-01`
})

// 타이어 날짜 가져오기
const getTireDate = (key: string) => {
  return props.vehicle.status[key] || defaultDate.value
}

// 타이어 상태에 따른 색상 클래스
const getTireColor = (key: string) => {
  const date = new Date(getTireDate(key))
  const now = new Date()
  const years = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365)
  
  if (years <= 2) return 'tire-green'
  if (years <= 4) return 'tire-yellow'
  return 'tire-red'
}

// 이벤트를 위/아래로 배치하는 로직
const shouldPlaceAbove = (eventId) => {
  const index = processedTimelineEvents.value.findIndex(event => event.id === eventId)
  return index % 2 === 0
}

// 이벤트 수직 위치 계산
const getVerticalPosition = (index: number) => {
  const TOTAL_SLOTS = 10 // 전체 슬롯 수
  const SLOT_HEIGHT = 100 / TOTAL_SLOTS // 각 슬롯의 높이 비율
  return index * SLOT_HEIGHT // 인덱스에 따른 수직 위치
}

// 타임라인 이벤트 계산
const timelineEvents = computed(() => {
  const events = []
  const purchaseDate = new Date(props.vehicle.purchaseYear + '-01-01')
  
  // 구매일 추가
  events.push({
    id: 'purchase',
    date: purchaseDate,
    label: '차량 구매',
    type: 'purchase',
    position: getYearPosition(parseInt(props.vehicle.purchaseYear))
  })

  // 상태 이벤트 추가
  const validKeys = [
    'engineOilChangeDate',
    'brakePadReplacementDate',
    'tireForeRightReplacementDate',
    'tireForeLeftReplacementDate',
    'tireBackRightReplacementDate',
    'tireBackLeftReplacementDate'
  ]

  Object.entries(props.vehicle.status).forEach(([key, value]) => {
    if (value && validKeys.includes(key)) {
      const date = new Date(value)
      const year = date.getFullYear()
      const position = getYearPosition(year)
      
      let label = ''
      
      switch (key) {
        case 'engineOilChangeDate':
          label = '엔진오일 교체'
          break
        case 'brakePadReplacementDate':
          label = '브레이크 패드 교체'
          break
        case 'tireForeRightReplacementDate':
          label = '앞바퀴 오른쪽 타이어'
          break
        case 'tireForeLeftReplacementDate':
          label = '앞바퀴 왼쪽 타이어'
          break
        case 'tireBackRightReplacementDate':
          label = '뒷바퀴 오른쪽 타이어'
          break
        case 'tireBackLeftReplacementDate':
          label = '뒷바퀴 왼쪽 타이어'
          break
      }

      events.push({
        id: key,
        date,
        label,
        type: 'maintenance',
        position
      })
    }
  })

  // 날짜순으로 정렬하고 수직 위치 할당
  return events
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((event, index) => ({
      ...event,
      verticalPosition: getVerticalPosition(index)
    }))
})

// 공백기를 포함한 타임라인 이벤트 처리를 제거하고 timelineEvents를 직접 사용
const processedTimelineEvents = computed(() => {
  return timelineEvents.value
})

// 타임라인 연도 계산
const timelineYears = computed(() => {
  const years = []
  const startYear = parseInt(props.vehicle.purchaseYear) - 1
  const currentYear = new Date().getFullYear() + 1
  
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year)
  }
  
  return years
})

// 연도 위치 계산
const getYearPosition = (year: number) => {
  const startYear = parseInt(props.vehicle.purchaseYear) - 1
  const currentYear = new Date().getFullYear() + 1
  return ((year - startYear) / (currentYear - startYear)) * 100
}

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.timeline-container {
  position: relative;
  width: 100%;
  height: 600px;
  margin: 20px 0;
  padding-top: 20px;
}

.timeline-events {
  position: relative;
  height: calc(100% - 50px);
}

.timeline-event {
  position: absolute;
  transform: translateX(-50%);
}

.event-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  background-color: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 타임라인 위의 이벤트인 경우 */
.timeline-event:nth-child(odd) .event-content {
  margin-bottom: 20px;
}

/* 타임라인 아래의 이벤트인 경우 */
.timeline-event:nth-child(even) .event-content {
  margin-top: 20px;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ddd;
  transform: translateY(-50%);
}

.timeline-years {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
}

.year-marker {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: #666;
  padding-top: 10px;
  background-color: white;
}

/* 이벤트 레이블 스타일 */
.event-label {
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 4px;
  word-break: keep-all;
  line-height: 1.2;
}

.event-date {
  font-size: 0.8rem;
  color: #666;
}

/* 이벤트 타입별 색상 */
.event-purchase {
  background-color: #4CAF50;
}

.event-maintenance {
  background-color: #2196F3;
}

.event-default {
  background-color: #9E9E9E;
}

/* 타이어 상태 색상 */
.tire-green {
  background-color: #4CAF50;
  color: white;
}

.tire-yellow {
  background-color: #FFC107;
  color: black;
}

.tire-red {
  background-color: #F44336;
  color: white;
}

/* 타이어 상태 표시 */
.tire-status-container {
  padding: 20px;
}

.tire-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.tire-position {
  position: relative;
  text-align: center;
}

.tire-icon {
  font-size: 2rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #f5f5f5;
  border-radius: 50%;
  margin: 0 auto;
}

.tire-date {
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;
  margin-bottom: 5px;
  text-align: center;
}

:deep(.v-table) {
  background-color: transparent;
}

:deep(.v-table th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

:deep(.v-table td) {
  padding: 8px 16px;
}

:deep(.v-text-field) {
  background-color: transparent;
}
</style> 