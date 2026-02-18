export type Member = {
    id: number
    name: string
  }
  
export type Admin = {
    id: number
    name: string
  }
  
  export type Room = {
    id: number
    slug: string
    admin: Admin
    members: Member[]
    adminId: number
    createdAt: string
  }
  