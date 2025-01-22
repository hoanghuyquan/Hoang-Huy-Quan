import { UserGender, UserProfile } from '~models'
import { apiGet, apiPost } from '~core'
import { put, select, takeEvery } from 'redux-saga/effects'
import { userAction, userState } from '~redux'

import { AxiosResponse } from 'axios'
import { PayloadAction } from '@reduxjs/toolkit'
import { RouteName } from './userProfileSaga'
import { orderBy } from 'lodash'

export const AdminRouteName = {
  deleteUser: '/delete-user',
  getUser: '/get-user',
  getUsers: '/get-users',
  route: '/admin',
  updateUser: '/update-user',
  updateUserScore: '/update-user-score',
}

export const GET_USERS = 'GET_USERS'
export const LOAD_MORE_USERS = 'LOAD_MORE_USERS'
export const GET_USER = 'GET_USER'
export const CREATE_USER = 'CREATE_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const DELETE_USER = 'DELETE_USER'
export const UPDATE_USER_SCORE = 'UPDATE_USER_SCORE'

export const LIMIT_USER_ITEM = 10

interface GetUsersParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
  payload: {
    gender?: UserGender,
    limit?: number,
    page?: number,
    search?: string
  }
}
function* getUsers({ onFailure, onSuccess, payload }: GetUsersParams) {
  try {
    yield put(userAction.setLoading(true))
    yield put(userAction.setCurrentPage(1))
    yield put(userAction.setTotalPages(1))
    const response: AxiosResponse = yield apiGet({
      params: { limit: LIMIT_USER_ITEM, ...payload },
      url: `${AdminRouteName.route}${AdminRouteName.getUsers}`,
    })
    yield put(userAction.setUsers(response?.data?.result?.users as UserProfile[]))
    yield put(userAction.setCurrentPage(response?.data?.result?.currentPage || 1))
    yield put(userAction.setTotalPages(response?.data?.result?.totalPages || 1))
    yield put(userAction.setLoading(false))
    onSuccess?.(response?.data?.result?.users)
  } catch (e: any) {
    yield put(userAction.setLoading(false))
    onFailure?.(e)
  }
}

function* loadMoreUsers({ onFailure, onSuccess, payload }: GetUsersParams) {
  try {
    const { currentPage, totalPages } = yield select(userState)
    yield put(userAction.setLoading(true))
    const response: AxiosResponse = yield apiGet({
      params: { limit: LIMIT_USER_ITEM, ...payload },
      url: `${AdminRouteName.route}${AdminRouteName.getUsers}`,
    })
    yield put(userAction.setUsers(response?.data?.result?.users as UserProfile[]))
    yield put(userAction.setCurrentPage(response?.data?.result?.currentPage || currentPage))
    yield put(userAction.setTotalPages(response?.data?.result?.totalPages || totalPages))
    yield put(userAction.setLoading(false))
    onSuccess?.(response?.data?.result?.users)
  } catch (e: any) {
    yield put(userAction.setLoading(false))
    onFailure?.(e)
  }
}

interface GetUserParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
  payload: { _id: string }
}
function* getUser({ onFailure, onSuccess, payload }: GetUserParams) {
  try {
    yield put(userAction.setLoading(true))
    const response: AxiosResponse = yield apiGet({
      params: payload,
      url: `${AdminRouteName.route}${AdminRouteName.getUser}`,
    })
    yield put(userAction.setUser(response?.data?.result?.user as UserProfile))
    yield put(userAction.setLoading(false))
    onSuccess?.(response?.data?.result?.user)
  } catch (e: any) {
    yield put(userAction.setLoading(false))
    onFailure?.(e)
  }
}

interface UpdateUserParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
  payload: {
    _id: string,
    dob: number
    email?: string
    gender: UserGender
    name: string
    phone?: string
  }
}

function* updateUser({ onFailure, onSuccess, payload }: UpdateUserParams) {
  try {
    yield put(userAction.setLoading(true))
    const response: AxiosResponse = yield apiPost({
      params: payload,
      url: `${AdminRouteName.route}${AdminRouteName.updateUser}`,
    })
    yield put(userAction.setUser(response?.data?.result?.userProfile as UserProfile))
    yield put(userAction.setLoading(false))
    onSuccess?.()
  } catch (e: any) {
    yield put(userAction.setLoading(false))
    onFailure?.(e)
  }
}

interface DeleteUserParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
  payload: { _id: string }
}

function* deleteUser({ onFailure, onSuccess, payload }: DeleteUserParams) {
  try {
    yield put(userAction.setLoading(true))
    const response: AxiosResponse = yield apiPost({
      params: payload,
      url: `${AdminRouteName.route}${AdminRouteName.deleteUser}`,
    })
    yield put(userAction.removeUser(response?.data?.result?.userProfile?._id as string))
    yield put(userAction.setLoading(false))
    onSuccess?.()
  } catch (e: any) {
    yield put(userAction.setLoading(false))
    onFailure?.(e)
  }
}

interface CreateUserParams extends PayloadAction<any> {
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

function* createUser({ onFailure, onSuccess, payload }: CreateUserParams) {
  try {
    const { users } = yield select(userState)
    yield put(userAction.setLoading(true))
    const response: AxiosResponse = yield apiPost({
      params: payload,
      url: `${RouteName.route}${RouteName.signUp}`,
    })
    yield put(userAction.setUsers([response?.data?.result?.user as UserProfile, ...users]))
    yield put(userAction.setLoading(false))
    onSuccess?.()
  } catch (e: any) {
    yield put(userAction.setLoading(false))
    onFailure?.(e)
  }
}

interface UpdateUserScoreParams extends PayloadAction<any> {
  onFailure?: (params?: any) => void
  onSuccess?: (params?: any) => void
  payload: {
    _id: string,
    score: number
  }
}

function* updateUserScore({ onFailure, onSuccess, payload }: UpdateUserScoreParams) {
  try {
    yield put(userAction.setLoading(true))
    const response: AxiosResponse = yield apiPost({
      params: payload,
      url: `${AdminRouteName.route}${AdminRouteName.updateUserScore}`,
    })
    yield put(userAction.setUser(response?.data?.result?.userProfile as UserProfile))
    const { users } = yield select(userState)
    yield put(userAction.setUsers(orderBy(users, ['totalScore'], ['desc'])))

    yield put(userAction.setLoading(false))
    onSuccess?.()
  } catch (e: any) {
    yield put(userAction.setLoading(false))
    onFailure?.(e)
  }
}

export function* userSaga() {
  yield takeEvery(CREATE_USER, createUser)
  yield takeEvery(GET_USER, getUser)
  yield takeEvery(GET_USERS, getUsers)
  yield takeEvery(LOAD_MORE_USERS, loadMoreUsers)
  yield takeEvery(UPDATE_USER, updateUser)
  yield takeEvery(DELETE_USER, deleteUser)
  yield takeEvery(UPDATE_USER_SCORE, updateUserScore)
}
