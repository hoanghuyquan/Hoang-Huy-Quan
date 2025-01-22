import { ErrorsMessage, ProfileDecode, UserGender, UserProfile, UserRole, ValidateArray, validateField } from '~models'
import { Request, Response } from 'express'
import { checkPassword, countDocuments, createObjectID, deleteOne, findOne, generateToken, getErrorsMessage, handlerHttpsError, handlerHttpsSuccess, insertOne, toHashPassword } from '~utils'

import { CollectionName } from '~constants'
import { __ } from '~localization'

interface SignInRequest extends Request {
  body: { password: string; username: string }
}
export async function signIn(req: SignInRequest, res: Response): Promise<any> {
  try {
    const {
      password,
      username,
    } = req?.body || {}
    if (!password) return handlerHttpsError({ message: __('user.wrongPassword'), res })
    const userRes = await findOne({
      collectionName: CollectionName.User,
      query: { username },
    })
    if (!userRes?.result) return handlerHttpsError({ message: __('user.wrongAccount'), res })
    const userProfile = userRes?.result as UserProfile
    const isMatch = await checkPassword(password, userProfile?.password)
    if (!isMatch) return handlerHttpsError({ message: __('user.wrongPassword'), res })

    delete (userProfile as any).password
    const { token } = generateToken(userProfile)
    await insertOne({
      collectionName: CollectionName.UserSession,
      query: {
        accessToken: token,
        userId: createObjectID(userProfile._id),
      },
    })
    handlerHttpsSuccess({
      res,
      result: {
        accessToken: token,
        userProfile,
      },
    })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}

interface SignUpBody {
  address: string
  dob: number
  email: string
  gender: UserGender
  name: string
  password: string
  phone: string
  username: string
}

interface SignUpRequest extends Request {
  body: SignUpBody
}

function validateSignUp(params: SignUpBody): {
  errorsMessage: ErrorsMessage
} {
  const {
    address,
    dob,
    email,
    gender,
    name,
    password,
    phone,
    username,
  } = params || {}
  const errorsMessage: ErrorsMessage = []
  const validateArray: ValidateArray = [
    { field: 'name', require: true, value: name },
    { field: 'address', value: address },
    { field: 'email', value: email },
    { field: 'gender', value: gender },
    { field: 'dob', type: 'number', value: dob },
    { field: 'username', require: true, value: username },
    { field: 'password', require: true, value: password },
    { field: 'phone', value: phone },
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
  return { errorsMessage }
}

export async function signUp(req: SignUpRequest, res: Response): Promise<any> {
  try {
    const { address, dob, email, gender, name, password, phone, username } =
      req?.body || {}
    const userRes = await findOne({
      collectionName: CollectionName.User,
      query: { username },
    })
    if (userRes?.result) return handlerHttpsError({ message: __('user.wrongHasAccount'), res })
    const { errorsMessage } = validateSignUp({
      address,
      dob,
      email,
      gender,
      name,
      password,
      phone,
      username,
    })
    if (errorsMessage.length > 0) {
      return handlerHttpsError({ message: getErrorsMessage(errorsMessage), res })
    }

    const passwordHash = await toHashPassword(password)

    const userCountRes = await countDocuments({
      collectionName: CollectionName.User,
      query: {},
    })

    const insertRes = await insertOne({
      collectionName: CollectionName.User,
      query: {
        address,
        dob: dob || Date.now(),
        email,
        gender: gender || UserGender.NULL,
        name,
        password: passwordHash,
        phone: phone,
        totalScore: 0,
        userRole: userCountRes?.result > 0 ? UserRole.USER : UserRole.ADMIN, // adhoc for create admin user
        username
      },
    })
    const userInsertRes = await findOne({
      collectionName: CollectionName.User,
      query: { _id: createObjectID(insertRes.result?.insertedId) },
    })
    delete (userInsertRes?.result as any).password
    handlerHttpsSuccess({ res, result: { user: userInsertRes?.result } })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}

export async function signOut(_profile: ProfileDecode, req: Request, res: Response) {
  try {
    const token = req?.headers?.authorization || ''
    await deleteOne({
      collectionName: CollectionName.UserSession,
      query: { accessToken: token },
    })
    handlerHttpsSuccess({ res })
  } catch (error: any) {
    handlerHttpsError({
      message: error?.message,
      res,
      status: error.status,
    })
  }
}
