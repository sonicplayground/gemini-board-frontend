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
            <!-- 연도 표시 -->
            <div class="timeline-years">
              <div
                v-for="year in timelineYears"
                :key="year"
                class="timeline-year"
                :style="{ left: `${getYearPosition(year)}%` }"
              >
                {{ year }}년
              </div>
            </div>

            <!-- 타임라인 이벤트 -->
            <div class="timeline-events">
              <div
                v-for="(event, index) in processedTimelineEvents"
                :key="event.id"
                class="timeline-event"
                :style="{
                  left: `${event.position}%`,
                  top: `${index * 60}px` // 각 이벤트를 60px 간격으로 배치
                }"
              >
                <div class="event-icon" :class="getEventColor(event.type)">
                  <v-icon>{{ event.icon }}</v-icon>
                </div>
                <div class="event-label">{{ event.label }}</div>
                <div class="event-date">{{ formatDate(event.date) }}</div>
              </div>
            </div>

            <!-- 타임라인 선 -->
            <div class="timeline-line"></div>

            <!-- 간격 표시 -->
            <div
              v-for="(gap, index) in timelineGaps"
              :key="'gap-' + index"
              class="timeline-gap"
              :style="{
                left: `${gap.position}%`,
                width: `${gap.width}%`
              }"
            >
              <div class="gap-marker">...</div>
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

// 이벤트 타입에 따른 색상 클래스
const getEventColor = (type: string) => {
  switch (type) {
    case 'purchase':
      return 'event-purchase'
    case 'maintenance':
      return 'event-maintenance'
    default:
      return 'event-default'
  }
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
    position: getYearPosition(parseInt(props.vehicle.purchaseYear)),
    icon: 'mdi-car'
  })

  // 상태 이벤트 추가 (mileage 제외)
  Object.entries(props.vehicle.status).forEach(([key, value]) => {
    if (value && key !== 'mileage') {
      const date = new Date(value)
      const year = date.getFullYear()
      const position = getYearPosition(year)
      
      let label = ''
      let icon = 'mdi-tools'
      
      switch (key) {
        case 'engineOilChangeDate':
          label = '엔진오일 교체'
          icon = 'mdi-oil'
          break
        case 'brakePadReplacementDate':
          label = '브레이크 패드 교체'
          icon = 'mdi-brake'
          break
        case 'tireForeRightReplacementDate':
          label = '앞바퀴 오른쪽 타이어'
          icon = 'mdi-tire'
          break
        case 'tireForeLeftReplacementDate':
          label = '앞바퀴 왼쪽 타이어'
          icon = 'mdi-tire'
          break
        case 'tireBackRightReplacementDate':
          label = '뒷바퀴 오른쪽 타이어'
          icon = 'mdi-tire'
          break
        case 'tireBackLeftReplacementDate':
          label = '뒷바퀴 왼쪽 타이어'
          icon = 'mdi-tire'
          break
        default:
          label = key
      }

      events.push({
        id: key,
        date,
        label,
        type: 'maintenance',
        position,
        icon
      })
    }
  })

  return events.sort((a, b) => a.date.getTime() - b.date.getTime())
})

// 공백기를 포함한 타임라인 이벤트 처리
const processedTimelineEvents = computed(() => {
  const events = timelineEvents.value
  const processedEvents = []
  const GAP_THRESHOLD = 10 // 10% 이상의 공백을 요약

  for (let i = 0; i < events.length; i++) {
    processedEvents.push(events[i])

    // 마지막 이벤트가 아니고, 다음 이벤트와의 간격이 임계값을 초과하는 경우
    if (i < events.length - 1) {
      const gap = events[i + 1].position - events[i].position
      if (gap > GAP_THRESHOLD) {
        processedEvents.push({
          id: `gap-${i}`,
          isGap: true,
          position: events[i].position + gap / 2,
          date: new Date(events[i].date.getTime() + (events[i + 1].date.getTime() - events[i].date.getTime()) / 2)
        })
      }
    }
  }

  return processedEvents
})
</script>

<style scoped>
.timeline-container {
  position: relative;
  width: 100%;
  min-width: 1000px;
  height: 400px; /* 높이 증가 */
  margin: 40px 0;
  padding: 0 20px;
  overflow-x: auto;
}

.timeline-years {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  border-top: 1px solid #ddd;
}

.timeline-year {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #666;
}

.timeline-events {
  position: relative;
  height: calc(100% - 30px); /* 연도 표시 영역 제외 */
  margin-bottom: 30px;
}

.timeline-event {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.event-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.event-label {
  font-size: 0.8rem;
  margin-bottom: 4px;
  white-space: nowrap;
}

.event-date {
  font-size: 0.7rem;
  color: #666;
}

.timeline-line {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ddd;
  z-index: 1;
}

.timeline-gap {
  position: absolute;
  bottom: 30px;
  height: 2px;
  background-color: #ddd;
  z-index: 1;
}

.gap-marker {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f5f5f5;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
  z-index: 2;
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