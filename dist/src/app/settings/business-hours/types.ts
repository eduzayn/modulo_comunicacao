export interface DaySchedule {
  enabled: boolean
  openTime?: string
  closeTime?: string
}

export interface BusinessHours {
  id: string
  name: string
  schedule: {
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule
  }
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CreateBusinessHoursFormData {
  name: string
  schedule: {
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule
  }
} 