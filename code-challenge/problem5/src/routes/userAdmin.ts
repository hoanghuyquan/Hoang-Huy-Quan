import { ErrorsMessage, ProfileDecode, UserGender, UserProfile, ValidateArray, validateField } from '~models'
import { Request, Response } from 'express'
import { countDocuments, createObjectID, deleteOne, find, findOne, getErrorsMessage, handlerHttpsError, handlerHttpsSuccess, updateOne } from '~utils'

import { CollectionName } from '~constants'
import { __ } from '~localization'
import { isEmpty } from 'lodash'

interface GetUserRequest extends Request {
  query: { _id: string }
}
export async function getUser(_profile: ProfileDecode, req: GetUserRequest, res: Response) {
  try {
    const { _id } = req?.query || {}
    const userRes = await findOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(_id) },
    })
    handlerHttpsSuccess({ res, result: { user: userRes.result } })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}

interface GetUsersRequest extends Request {
  query: {
    gender?: UserGender,
    limit?: string,
    page?: string,
    search?: string
  }
}
export async function getUsers(_profile: ProfileDecode, req: GetUsersRequest, res: Response) {
  try {
    const {
      gender,
      limit = '10',
      page = '1',
      search = ''
    } = req?.query || {}

    const parsedLimit = parseInt(limit, 10) || 10
    const parsedPage = parseInt(page, 10) || 1
    const model = {} as any

    if (!isEmpty(search)) {
      model.$or = [
        { address: new RegExp(search, 'i') },
        { dob: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { gender: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { username: new RegExp(search, 'i') },
      ]
    }

    if (!isEmpty(gender)) {
      model.gender = gender
    }

    const totalCount = await countDocuments({
      collectionName: CollectionName.User,
      query: model,
    })

    const skip = (parsedPage - 1) * parsedLimit

    const usersRes = await find({
      collectionName: CollectionName.User,
      limit: parsedLimit,
      query: model,
      skip,
      sort: { totalScore: -1 },
    })

    const totalPages = Math.ceil(totalCount.result / parsedLimit)

    handlerHttpsSuccess({
      res,
      result: { currentPage: page, totalPages, users: usersRes?.result },
    })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}

interface UpdateUserParams {
  _id: string
  dob: number
  email?: string
  gender: UserGender
  name: string
  phone?: string
}

interface UpdateUserRequest extends Request {
  body: UpdateUserParams
}

export function validateUpdateUser(params: UpdateUserParams): {
  errorsMessage: ErrorsMessage
} {
  const { dob, email, gender, name, phone } = params || {}
  const errorsMessage: ErrorsMessage = []
  const validateArray: ValidateArray = [
    { field: 'name', require: true, value: name },
    { field: 'gender', value: gender },
    { field: 'dob', type: 'number', value: dob },
    { field: 'phone', value: phone },
    { field: 'email', value: email },
  ]
  validateArray.forEach((item) => {
    validateField({
      ...item,
      errorsMessage,
      localizationSource: 'user.signUp',
    })
  })
  if (
    gender &&
    gender !== UserGender.FEMALE &&
    gender !== UserGender.MALE &&
    gender !== UserGender.NULL
  ) {
    errorsMessage.push({
      field: 'gender',
      message: 'user.signUpInvalidGender',
    })
  }
  if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errorsMessage.push({
      field: 'email',
      message: 'user.signUpInvalidEmail',
    })
  }
  return { errorsMessage }
}

export async function updateUser(
  _profile: UserProfile,
  req: UpdateUserRequest,
  res: Response,
) {
  try {
    const { _id, dob, email, gender, name, phone } = req?.body || {}
    const { errorsMessage } = validateUpdateUser({
      _id,
      dob,
      email,
      gender,
      name,
      phone,
    })
    if (errorsMessage.length > 0) {
      return handlerHttpsError({ message: getErrorsMessage(errorsMessage), res })
    }
    await updateOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(_id) },
      values: { $set: { dob, email, gender, name, phone } },
    })
    const userRes = await findOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(_id) },
    })
    const userProfile = userRes?.result as UserProfile
    delete (userProfile as any).password
    handlerHttpsSuccess({ res, result: { userProfile } })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}

interface DeleteUserRequest extends Request {
  body: { _id: string }
}
export async function deleteUser(
  _profile: ProfileDecode,
  req: DeleteUserRequest,
  res: Response,
) {
  try {
    const { _id } = req?.body || {}
    const userRes = await findOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(_id) },
    })
    if (!userRes?.result) return handlerHttpsError({ message: __('user.wrongAccount'), res })
    await deleteOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(_id) },
    })
    handlerHttpsSuccess({ res, result: { userProfile: { _id } } })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}

interface UpdateUserScoreRequest extends Request {
  body: { _id: string, score: number }
}
export async function updateUserScore(
  _profile: ProfileDecode,
  req: UpdateUserScoreRequest,
  res: Response,
) {
  try {
    const { _id, score } = req?.body || {}
    const userRes = await findOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(_id) },
    })
    if (!userRes?.result) return handlerHttpsError({ message: __('user.wrongAccount'), res })
    await updateOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(_id) },
      values: { $set: { totalScore: userRes?.result?.totalScore + score } }
    })
    handlerHttpsSuccess({ res, result: { userProfile: { ...userRes?.result, totalScore: userRes?.result?.totalScore + score } } })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}
