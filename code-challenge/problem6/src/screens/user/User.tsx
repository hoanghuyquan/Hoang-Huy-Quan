import { Card, Form, InputGroup, Table } from 'react-bootstrap'
import { CreateUser, DetailUser, UserItem } from './components'
import { GET_USERS, LOAD_MORE_USERS } from '~saga'
import { useAppDispatch, useAppSelector } from '~core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { userProfileState, userState } from '~redux'

import { Paging } from '~components'
import { UserGender } from '~models'
import { debounce } from 'lodash'

export function User() {
  const dispatch = useAppDispatch()
  const { currentPage, totalPages, users } = useAppSelector(userState) || {}
  const { accessToken } = useAppSelector(userProfileState) || {}
  const [search, setSearch] = useState<string>('')
  const [genderSearch, setGenderSearch] = useState<UserGender>()
  const [isFetched, setFetched] = useState<boolean>(false)
  const createUserRefs = useRef<any>()
  const detailUserRefs = useRef<any>()

  const getUsers = useCallback(() => {
    if (accessToken) {
      dispatch({
        onSuccess: () => setFetched(true),
        payload: { gender: genderSearch, search },
        type: GET_USERS,
      })
    }
  }, [dispatch, search, accessToken, genderSearch])

  useEffect(() => {
    const debouncedGetPosts = debounce(getUsers, 1000)
    debouncedGetPosts()
    return () => {
      debouncedGetPosts.cancel()
    }
  }, [getUsers])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  function onChangePage(page: number) {
    isFetched &&
      dispatch({
        payload: { page, search },
        type: LOAD_MORE_USERS,
      })
  }

  return (
    <div className='container-fluid p-3'>
      <Form.Group className='d-flex align-items-center justify-content-between mb-3'>
        <Form.Label className='fw-bold'>Danh sách người dùng</Form.Label>
        <CreateUser buttonLbl='Thêm' content='Thêm người dùng' title='Thêm người dùng' />
      </Form.Group>
      <InputGroup className='mb-3'>
        <InputGroup.Text className='fw-bold'>Người dùng</InputGroup.Text>
        <Form.Control
          placeholder='Tìm họ tên, SĐT, email'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <InputGroup className='mb-3'>
        <InputGroup.Text className='fw-bold'>Giới tính</InputGroup.Text>
        <Form.Select onChange={(e: any) => setGenderSearch(e.target.value)}>
          <option>
            {genderSearch === UserGender.MALE
              ? 'Nam'
              : genderSearch === UserGender.FEMALE
                ? 'Nữ'
                : 'Chọn giới tính'}
          </option>
          <option value={''}>Tất cả</option>
          <option value={UserGender.MALE}>Nam</option>
          <option value={UserGender.FEMALE}>Nữ</option>
        </Form.Select>
      </InputGroup>
      <Card className='table-wrapper table-responsive shadow-sm mb-5'>
        <Card.Body className='pt-0'>
          <Table hover className='user-table align-items-center'>
            <thead>
              <tr>
                {['Điểm', 'Tài khoản', 'Tên', 'Giới tính', 'SĐT', 'Vai trò', 'Thao tác'].map(
                  (item, index) => (
                    <th className='border-bottom' key={`${index}`}>
                      {item}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <UserItem
                  editItem={createUserRefs?.current?.editItem}
                  item={item}
                  key={`${index}`}
                  showDetail={detailUserRefs?.current?.showDetail}
                />
              ))}
            </tbody>
          </Table>
          <Card.Footer className='px-3 border-0 d-lg-flex align-items-center justify-content-end'>
            <Paging currentPage={currentPage} totalPages={totalPages} onChangePage={onChangePage} />
          </Card.Footer>
        </Card.Body>
      </Card>
      <CreateUser
        textOnly
        buttonLbl='Sửa'
        content='Cập nhật người dùng'
        ref={createUserRefs}
        title=''
      />
      <DetailUser ref={detailUserRefs} />
    </div>
  )
}
