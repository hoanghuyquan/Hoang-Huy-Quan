import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'

import BgImage from '~assets/signin.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SIGN_IN } from '~saga'
import { useAppDispatch } from '~core'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function SignIn() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onSignIn = async () => {
    dispatch({
      onSuccess: () => navigate('/'),
      payload: { password, username },
      type: SIGN_IN,
    })
  }

  const onGoToSignUp = () => {
    navigate('/signUp')
  }

  return (
    <Row
      className='container-fluid col p-0 m-0 d-flex align-items-center justify-content-center'
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
        position: 'relative',
        width: '100%',
      }}
    >
      <Col className='d-flex align-items-center justify-content-center' md={6} xs={12}>
        <div className='bg-white shadow border rounded border-light p-4 p-lg-5 w-100 fmxw-500'>
          <div className='text-center text-md-center mb-4 mt-md-0'>
            <h3 className='mb-0'>Đăng nhập</h3>
          </div>
          <Form className='mt-4'>
            <Form.Group className='mb-4'>
              <Form.Label>Tài khoản</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faUser} />
                </InputGroup.Text>
                <Form.Control
                  autoFocus
                  placeholder='nhập tài khoản'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Mật khẩu</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faLock} />
                </InputGroup.Text>
                <Form.Control
                  placeholder='Nhập mật khẩu'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Button className='btn btn-dark w-100' type='button' onClick={onSignIn}>
              Đăng nhập
            </Button>
            <Button
              className='w-100 mt-2'
              type='button'
              variant='outline-dark'
              onClick={onGoToSignUp}
            >
              Đăng ký ngay
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  )
}
