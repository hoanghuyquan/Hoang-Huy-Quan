import { NotFound, ServerError, SignIn, SignUp } from './auth'
import { ReactNode, useEffect } from 'react'
import { createBrowserRouter, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~core'

import { Button } from 'react-bootstrap'
import { SIGN_OUT } from '~saga'
import { User } from './user'
import { userProfileState } from '~redux'

function RouterContainer({ children }: { children?: ReactNode }) {
  const { accessToken } = useAppSelector(userProfileState)
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!accessToken) navigate('/signIn')
  }, [navigate, accessToken])

  return (
    <>
      <div className='d-flex container-fluid p-0'>{children}</div>
      <div className='mt-3 p-3 justify-content-center'>
        <Button
          className='w-100'
          variant='danger'
          onClick={() => dispatch({ payload: { isRemoveToken: true }, type: SIGN_OUT })}
        >
          Đăng xuất
        </Button>
      </div>
    </>
  )
}

export const router = createBrowserRouter([
  {
    Component: () => (
      <RouterContainer>
        <User />
      </RouterContainer>
    ),
    id: 'root',
    path: '/',
  },
  {
    Component: () => (
      <RouterContainer>
        <User />
      </RouterContainer>
    ),
    id: 'users',
    path: '/users',
  },
  {
    Component: SignIn,
    id: 'signIn',
    path: '/signIn',
  },
  {
    Component: SignUp,
    id: 'signUp',
    path: '/signUp',
  },
  {
    Component: NotFound,
    id: 'not-found',
    path: '/404',
  },
  {
    Component: ServerError,
    id: 'server-error',
    path: '/500',
  },
  {
    Component: NotFound,
    id: 'redirect',
    path: '*',
  },
])
