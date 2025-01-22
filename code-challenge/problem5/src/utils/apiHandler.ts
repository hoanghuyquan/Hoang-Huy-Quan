import { ApiResponse, HttpsStatus, ProfileDecode, UserRole } from '~models'

import { Response } from 'express'
import { verifyToken } from './tokenUtils'

interface HttpsSuccess {
  message?: string
  res: Response
  result?: any
  status?: HttpsStatus
}

export function handlerHttpsSuccess({
  message = 'success',
  res,
  result,
  status = HttpsStatus.OK_200,
}: HttpsSuccess) {
  return res.status(status).json({ error: false, message, result } as ApiResponse)
}

interface HttpsError {
  message?: string
  res: Response
  status?: HttpsStatus
}

export function handlerHttpsError({
  message = 'failure',
  res,
  status = HttpsStatus.BadRequest_400,
}: HttpsError) {
  return res.status(status).json({ error: true, message } as ApiResponse)
}

export function checkAuthorized(
  wrapMethod: (...params: any) => any,
  userRole?: UserRole,
) {
  return async function (...args: any) {
    const authorization = args?.[0]?.headers?.authorization || ''
    try {
      const decodedToken = verifyToken(authorization)
      const decoded = decodedToken?.decoded as ProfileDecode
      if (userRole && decoded?.userRole !== userRole) {
        throw {
          error: true,
          message: 'unauthorized',
          status: HttpsStatus.Unauthorized_401,
        }
      }
      wrapMethod(decoded, ...args)
    } catch (error: any) {
      handlerHttpsError({
        message: error?.message,
        res: args?.[1],
        status: error?.status,
      })
    }
  }
}
