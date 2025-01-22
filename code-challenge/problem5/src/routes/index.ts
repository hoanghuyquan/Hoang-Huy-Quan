import { AdminRouteName, RouteName } from '~constants'
import { deleteUser, getUser, getUsers, updateUser, updateUserScore } from './userAdmin'
import { signIn, signOut, signUp, } from './user'

import { Router } from 'express'
import { UserRole } from '~models'
import { checkAuthorized } from '~utils'

export const userRoute: Router = Router()

userRoute.post(RouteName.signIn, signIn)
userRoute.post(RouteName.signUp, signUp)
userRoute.post(RouteName.signOut, checkAuthorized(signOut))

export const userAdminRoute: Router = Router()

userAdminRoute.get(AdminRouteName.getUser, checkAuthorized(getUser, UserRole.ADMIN))
userAdminRoute.get(AdminRouteName.getUsers, checkAuthorized(getUsers, UserRole.ADMIN))
userAdminRoute.post(AdminRouteName.updateUser, checkAuthorized(updateUser, UserRole.ADMIN))
userAdminRoute.post(AdminRouteName.deleteUser, checkAuthorized(deleteUser, UserRole.ADMIN))
userAdminRoute.post(AdminRouteName.updateUserScore, checkAuthorized(updateUserScore, UserRole.ADMIN))