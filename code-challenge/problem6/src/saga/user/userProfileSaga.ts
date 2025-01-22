import { UserGender, UserProfile } from '~models'
import { apiPost, persistor, store } from '~core'
import { put, takeEvery } from 'redux-saga/effects'

import { AxiosResponse } from 'axios'
import { PayloadAction } from '@reduxjs/toolkit'
import { userProfileAction } from '~redux'

export const RouteName = {
  route: '/user',
  signIn: '/sign-in',
  signOut: '/sign-out',
  signUp: '/sign-up',
}

export const SIGN_UP = 'SIGN_UP'
export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'


interface SignUpParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
  payload: {
    address: string
    dob: number
    email: string
    gender: UserGender
    name: string
    password: string
    phone: string
    username: string
  }
}

function* signUp({ onFailure, onSuccess, payload }: SignUpParams) {
  try {
    yield apiPost({
      params: payload,
      url: `${RouteName.route}${RouteName.signUp}`,
    })
    const response: AxiosResponse = yield apiPost({
      params: payload,
      url: `${RouteName.route}${RouteName.signIn}`,
    })
    yield put(userProfileAction.setUserProfile(response?.data?.result?.userProfile as UserProfile))
    yield put(userProfileAction.setAccessToken(response?.data?.result?.accessToken || ''))
    onSuccess?.()
  } catch (e: any) {
    onFailure?.(e)
  }
}

interface SignInParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
  payload: { password: string; username: string }
}

function* signIn({ onFailure, onSuccess, payload }: SignInParams) {
  try {
    const response: AxiosResponse = yield apiPost({
      params: payload,
      url: `${RouteName.route}${RouteName.signIn}`,
    })
    yield put(userProfileAction.setUserProfile(response?.data?.result?.userProfile as UserProfile))
    yield put(userProfileAction.setAccessToken(response?.data?.result?.accessToken || ''))
    onSuccess?.()
  } catch (e: any) {
    onFailure?.(e)
  }
}

interface SignOutParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
}

function* signOut({ onFailure, onSuccess }: SignOutParams) {
  try {
    yield apiPost({ params: {}, url: `${RouteName.route}${RouteName.signOut}` })
    yield put(store.dispatch({ type: 'RESET' }))
    yield persistor.purge()
    onSuccess?.()
  } catch (e: any) {
    onFailure?.(e)
  }
}

export function* userProfileSaga() {
  yield takeEvery(SIGN_UP, signUp)
  yield takeEvery(SIGN_IN, signIn)
  yield takeEvery(SIGN_OUT, signOut)
}
