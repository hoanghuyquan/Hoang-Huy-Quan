import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'

import BgImage from '~assets/signin.svg'
import { SIGN_UP } from '~saga'
import { UserGender } from '~models'
import dayjs from 'dayjs'
import { useAppDispatch } from '~core'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function parseDate(dateString?: string) {
  const parts = dateString?.split('-') || []
  if (parts.length !== 3) {
    return new Date(2024, 0, 1).valueOf()
  }
  const day = parseInt(parts[2], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[0], 10)
  const isValidDate = day > 0 && day <= 31 && month >= 0 && month <= 11 && year > 0
  if (!isValidDate) {
    return new Date(2024, 0, 1)
  }
  return new Date(year, month, day).valueOf()
}

export function SignUp() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [dob, setDob] = useState<string>()
  const [email, setEmail] = useState<string>('')
  const [gender, setGender] = useState<UserGender>(UserGender.NULL)
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')

  const onSignUp = async () => {
    dispatch({
      onSuccess: () => navigate('/'),
      payload: {
        address,
        dob: parseDate(dob)?.valueOf(),
        email,
        gender,
        name,
        password,
        phone,
        username,
      },
      type: SIGN_UP,
    })
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
            <h3 className='mb-0'>Đăng ký</h3>
          </div>
          <Form>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>Tên</InputGroup.Text>
              <Form.Control
                placeholder='Nhập tên người dùng'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>Địa chỉ</InputGroup.Text>
              <Form.Control
                placeholder='Nhập địa chỉ'
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>Ngày sinh</InputGroup.Text>
              <Form.Control
                max={dayjs(new Date()).format('YYYY-MM-DD')}
                type='date'
                value={dob}
                onChange={(e: any) => setDob(e?.target?.value)}
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>Email</InputGroup.Text>
              <Form.Control
                placeholder='Nhập email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>Giới tính</InputGroup.Text>
              <Form.Select onChange={(e: any) => setGender(e.target.value)}>
                <option>
                  {gender === UserGender.MALE
                    ? 'Nam'
                    : gender === UserGender.FEMALE
                      ? 'Nữ'
                      : 'Chọn giới tính'}
                </option>
                <option value={UserGender.MALE}>Nam</option>
                <option value={UserGender.FEMALE}>Nữ</option>
              </Form.Select>
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>SĐT</InputGroup.Text>
              <Form.Control
                placeholder='Nhập số điện thoại'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>Tài khoản</InputGroup.Text>
              <Form.Control
                placeholder='Nhập username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text className='fw-bold'>Mật khẩu</InputGroup.Text>
              <Form.Control
                placeholder='Nhập mật khẩu'
                security='true'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </Form>

          <Button className='btn btn-dark w-100' type='button' onClick={onSignUp}>
            Đăng ký
          </Button>
        </div>
      </Col>
    </Row>
  )
}
