import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '~core'
import { UserProfile } from '~models'

export interface UserState {
  currentPage: number
  loading: boolean
  totalPages: number
  users: UserProfile[]
}

const initialState: UserState = {
  currentPage: 1,
  loading: false,
  totalPages: 1,
  users: [],
} as UserState

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user._id !== action.payload)
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.users = state.users.map((item) => {
        if (item?._id === action?.payload?._id) {
          return {
            ...item,
            ...action?.payload,
          }
        }
        return item
      })
    },
    setUsers: (state, action: PayloadAction<UserProfile[]>) => {
      state.users = action.payload
    },
  },
})

export const userAction = userSlice.actions

export const userState = (state: RootState) => state.user

export const userReducer = userSlice.reducer
