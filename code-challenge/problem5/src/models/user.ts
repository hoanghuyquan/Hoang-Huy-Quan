export enum UserRole {
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
  USER = 'USER',
}

export enum UserGender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  NULL = 'NULL',
  OTHER = 'OTHER',
}

export interface UserProfile {
  _id: string
  address: string
  createdAt: Date | number
  dob: number
  email: string
  gender: UserGender
  name: string
  password: string
  phone: string
  totalScore: number,
  updatedAt: Date | number,
  userRole: UserRole,
  username: string
}

export interface ProfileDecode extends Omit<UserProfile, 'password'> { }

export interface UserSession {
  accessToken: string
  userId: string
}