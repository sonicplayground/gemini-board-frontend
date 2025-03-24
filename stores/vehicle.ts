import { defineStore } from 'pinia'
import { get, post, put, del } from '../utils/api'

interface Vehicle {
  id: string | number
  name: string
  manufacturer: string
  model: string
  year: number
  licensePlate: string
  createdAt?: string
  updatedAt?: string
}

interface VehicleState {
  vehicles: Vehicle[]
  currentVehicle: Vehicle | null
  loading: boolean
  error: string | null
}

export const useVehicleStore = defineStore('vehicle', {
  state: (): VehicleState => ({
    vehicles: [],
    currentVehicle: null,
    loading: false,
    error: null
  }),

  actions: {
    // 차량 목록 조회
    async fetchVehicles() {
      try {
        this.loading = true
        this.error = null
        this.vehicles = await get<Vehicle[]>('/vehicles')
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
    async fetchVehicle(id: string | number) {
      try {
        this.loading = true
        this.error = null
        this.currentVehicle = await get<Vehicle>(`/vehicles/${id}`)
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
    async updateVehicle(id: string | number, vehicleData: Partial<Vehicle>) {
      try {
        this.loading = true
        this.error = null
        const updatedVehicle = await put<Vehicle>(`/vehicles/${id}`, vehicleData)
        
        // 현재 차량 데이터 업데이트
        if (this.currentVehicle && this.currentVehicle.id === id) {
          this.currentVehicle = updatedVehicle
        }
        
        // 목록에서도 차량 데이터 업데이트
        const index = this.vehicles.findIndex(vehicle => vehicle.id === id)
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
    async deleteVehicle(id: string | number) {
      try {
        this.loading = true
        this.error = null
        await del(`/vehicles/${id}`)
        
        // 목록에서 차량 제거
        this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== id)
        
        // 현재 차량이 삭제된 차량과 같다면 null로 설정
        if (this.currentVehicle && this.currentVehicle.id === id) {
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