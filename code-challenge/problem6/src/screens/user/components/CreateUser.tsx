import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import { CREATE_USER, UPDATE_USER } from '~saga'
import { UserGender, UserProfile } from '~models'
import { forwardRef, useImperativeHandle, useState } from 'react'

import dayjs from 'dayjs'
import { useAppDispatch } from '~core'

function parseDate(dateString: string) {
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

function CreateUserBase(
  {
    buttonLbl,
    content,
    item,
    textOnly,
    title,
  }: {
    buttonLbl: string
    content: string
    item?: UserProfile
    textOnly?: boolean
    title: string
  },
  ref: any,
) {
  const dispatch = useAppDispatch()
  const [isUpdate, setUpdate] = useState<boolean>(false)
  const [showCreate, setShowCreate] = useState<boolean>(false)

  const [dob, setDob] = useState<string>(
    item?.dob ? dayjs(new Date(item?.dob || '')).format('YYYY-MM-DD') : '',
  )
  const [updateId, setUpdateId] = useState<string>('')
  const [gender, setGender] = useState<UserGender>(item?.gender || UserGender.NULL)
  const [name, setName] = useState<string>(item?.name || '')
  const [password, setPassword] = useState<string>('')
  const [phone, setPhone] = useState<string>(item?.phone || '')
  const [username, setUsername] = useState<string>(item?.username || '')
  const [address, setAddress] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  useImperativeHandle(ref, () => ({
    editItem,
  }))

  const clearData = () => {
    setShowCreate(false)
    setDob('')
    setGender(UserGender.NULL)
    setName('')
    setPassword('')
    setPhone('')
    setUsername('')
    setEmail('')
    setAddress('')
  }

  const handleShow = () => {
    setShowCreate(true)
  }

  const editItem = (itemEdit: UserProfile) => {
    setUpdate(true)
    setShowCreate(true)
    setUpdateId(itemEdit?._id || '')
    setDob(itemEdit?.dob ? dayjs(new Date(itemEdit?.dob || '')).format('YYYY-MM-DD') : '')
    setGender(itemEdit?.gender || UserGender.NULL)
    setName(itemEdit?.name || '')
    setPassword('')
    setPhone(itemEdit?.phone || '')
    setUsername(itemEdit?.username || '')
    setEmail(itemEdit?.email || '')
    setAddress(itemEdit?.address || '')
  }

  function createUser() {
    dispatch({
      onSuccess: clearData,
      payload: {
        ...(isUpdate ? { _id: updateId } : {}),
        address,
        dob: parseDate(dob)?.valueOf(),
        email,
        gender,
        name,
        password,
        phone,
        username,
      },
      type: isUpdate ? UPDATE_USER : CREATE_USER,
    })
  }

  return (
    <>
      {textOnly ? (
        <div onClick={handleShow}>{title}</div>
      ) : (
        <Button className='m-1' variant='dark' onClick={handleShow}>
          {title}
        </Button>
      )}

      <Modal fullscreen show={showCreate} onHide={clearData}>
        <Modal.Header closeButton>
          <Modal.Title>{content}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={clearData}>
            Hủy
          </Button>
          <Button variant='dark' onClick={createUser}>
            {buttonLbl}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const CreateUser = forwardRef(CreateUserBase)
