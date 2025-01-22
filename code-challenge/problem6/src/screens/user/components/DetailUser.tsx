import { Form, InputGroup, Modal } from 'react-bootstrap'
import { UserGender, UserProfile } from '~models'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { GET_USER } from '~saga'
import dayjs from 'dayjs'
import { useAppDispatch } from '~core'

function DetailUserBase(_props: any, ref: any) {
  const dispatch = useAppDispatch()
  const [isShowDetail, setShowDetail] = useState<boolean>(false)
  const [user, setUser] = useState<UserProfile>()

  const { address, dob, email, gender, name, phone, username } = user || {}

  useImperativeHandle(ref, () => ({
    showDetail,
  }))

  function showDetail(_id: string) {
    setShowDetail(true)
    dispatch({
      onFailure: () => setShowDetail(false),
      onSuccess: (userProfile: UserProfile) => setUser(userProfile),
      payload: { _id },
      type: GET_USER,
    })
  }

  return (
    <Modal fullscreen show={isShowDetail} onHide={() => setShowDetail(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{'Chi tiết người dùng'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <InputGroup className='mb-3'>
            <InputGroup.Text className='fw-bold'>Tên</InputGroup.Text>
            <Form.Control disabled placeholder='Nhập tên người dùng' type='text' value={name} />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text className='fw-bold'>Địa chỉ</InputGroup.Text>
            <Form.Control disabled placeholder='Nhập địa chỉ' type='text' value={address} />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text className='fw-bold'>Ngày sinh</InputGroup.Text>
            <Form.Control
              disabled
              max={dayjs(new Date()).format('YYYY-MM-DD')}
              type='date'
              value={dob}
            />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text className='fw-bold'>Email</InputGroup.Text>
            <Form.Control disabled placeholder='Nhập email' type='text' value={email} />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text className='fw-bold'>Giới tính</InputGroup.Text>
            <Form.Select disabled>
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
            <Form.Control disabled placeholder='Nhập số điện thoại' value={phone} />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text className='fw-bold'>Tài khoản</InputGroup.Text>
            <Form.Control disabled placeholder='Nhập username' value={username} />
          </InputGroup>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export const DetailUser = forwardRef(DetailUserBase)
