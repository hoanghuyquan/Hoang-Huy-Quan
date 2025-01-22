import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '~core'
import { UserProfile } from '~models'

export interface UserProfileState {
  accessToken?: string
  userProfile?: UserProfile
}

const initialState: UserProfileState = {} as UserProfileState

const userProfileSlice = createSlice({
  initialState,
  name: 'userProfile',
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | undefined>) => {
      state.accessToken = action.payload
    },
    setUserProfile: (state, action: PayloadAction<any | undefined>) => {
      state.userProfile = action.payload
    },
  },
})

export const userProfileAction = userProfileSlice.actions

export const userProfileState = (state: RootState) => state.userProfile

export const userProfileReducer = userProfileSlice.reducer
