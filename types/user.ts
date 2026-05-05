export interface User {
  id?: string
  name: string
  email: string
  //password: string
  createdAt: Date
  cpf?: string
  address?: Address[]
  phone?: string
}

export interface Address {
  label: string
  addr: string
  default: boolean
}