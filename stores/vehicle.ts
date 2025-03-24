import { defineStore } from 'pinia'
import { get, post, put, del } from '../utils/api'

interface VehicleStatus {
  mileage: string
  tireReplacementDate?: string
  engineOilChangeDate?: string
  tireForeRightReplacementDate?: string
  [key: string]: any
}

interface Vehicle {
  vehicleKey: string  // id 대신 vehicleKey 사용
  name: string
  manufacturer: string
  modelName: string  // model 대신 modelName 사용
  purchaseYear: string
  vin?: string | null
  vehiclePicture?: string | null
  registrationPicture?: string | null
  status: VehicleStatus
  memo?: string | null
  ownerUserKey: string
}

interface VehiclePagination {
  totalElements: number
  totalPages: number
  size: number
  number: number
  content: Vehicle[]
}

interface VehicleState {
  vehicles: Vehicle[]
  currentVehicle: Vehicle | null
  pagination: {
    totalElements: number
    totalPages: number
    size: number
    currentPage: number
  }
  loading: boolean
  error: string | null
}

export const useVehicleStore = defineStore('vehicle', {
  state: (): VehicleState => ({
    vehicles: [],
    currentVehicle: null,
    pagination: {
      totalElements: 0,
      totalPages: 0,
      size: 10,
      currentPage: 0
    },
    loading: false,
    error: null
  }),

  actions: {
    // 차량 목록 조회
    async fetchVehicles(page = 0, size = 10) {
      try {
        this.loading = true
        this.error = null
        
        // 페이지네이션 파라미터 추가
        const response = await get<VehiclePagination>(`/vehicles?page=${page}&size=${size}`)
        
        // 페이지네이션 정보 저장
        this.pagination = {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          size: response.size,
          currentPage: response.number
        }
        
        // content 배열에서 차량 데이터 추출
        this.vehicles = response.content
        
        return this.vehicles
      } catch (error: any) {
        this.error = error.message || '차량 목록을 불러오는데 실패했습니다.'
        console.error('차량 목록 조회 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 특정 차량 조회
    async fetchVehicle(vehicleKey: string) {
      try {
        this.loading = true
        this.error = null
        this.currentVehicle = await get<Vehicle>(`/vehicles/${vehicleKey}`)
        return this.currentVehicle
      } catch (error: any) {
        this.error = error.message || '차량 정보를 불러오는데 실패했습니다.'
        console.error('차량 정보 조회 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 차량 생성
    async createVehicle(vehicleData: Partial<Vehicle>) {
      try {
        this.loading = true
        this.error = null
        const newVehicle = await post<Vehicle>('/vehicles', vehicleData)
        this.vehicles.push(newVehicle)
        return newVehicle
      } catch (error: any) {
        this.error = error.message || '차량 생성에 실패했습니다.'
        console.error('차량 생성 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 차량 정보 수정
    async updateVehicle(vehicleKey: string, vehicleData: Partial<Vehicle>) {
      try {
        this.loading = true
        this.error = null
        const updatedVehicle = await put<Vehicle>(`/vehicles/${vehicleKey}`, vehicleData)
        
        // 현재 차량 데이터 업데이트
        if (this.currentVehicle && this.currentVehicle.vehicleKey === vehicleKey) {
          this.currentVehicle = updatedVehicle
        }
        
        // 목록에서도 차량 데이터 업데이트
        const index = this.vehicles.findIndex(vehicle => vehicle.vehicleKey === vehicleKey)
        if (index !== -1) {
          this.vehicles[index] = updatedVehicle
        }
        
        return updatedVehicle
      } catch (error: any) {
        this.error = error.message || '차량 정보 수정에 실패했습니다.'
        console.error('차량 정보 수정 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 차량 삭제
    async deleteVehicle(vehicleKey: string) {
      try {
        this.loading = true
        this.error = null
        await del(`/vehicles/${vehicleKey}`)
        
        // 목록에서 차량 제거
        this.vehicles = this.vehicles.filter(vehicle => vehicle.vehicleKey !== vehicleKey)
        
        // 현재 차량이 삭제된 차량과 같다면 null로 설정
        if (this.currentVehicle && this.currentVehicle.vehicleKey === vehicleKey) {
          this.currentVehicle = null
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || '차량 삭제에 실패했습니다.'
        console.error('차량 삭제 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 