export type VacationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type Employee = {
  id: string
  name: string
  email: string
}

export type Vacation = {
  id: string
  startDate: string
  endDate: string
  days: number
  status: VacationStatus
  rejectionReason: string | null
  decidedAt: string | null
  createdAt: string
  employee?: Employee
}
