import { DELETE_USER, UPDATE_USER_SCORE } from '~saga'
import { UserGender, UserProfile, UserRole } from '~models'

import { Dropdown } from 'react-bootstrap'
import { toastServices } from '~utils'
import { useAppDispatch } from '~core'

export function UserItem({
  editItem = () => {},
  item,
  showDetail = () => {},
}: {
  editItem?: (item: UserProfile) => void
  item: UserProfile
  showDetail?: (_id: string) => void
}) {
  const { _id, gender, name, phone, totalScore, userRole, username } = item || {}

  const dispatch = useAppDispatch()

  const display = [
    { value: totalScore || 0 },
    { value: username },
    { value: name },
    {
      value: gender === UserGender.MALE ? 'Nam' : gender === UserGender.FEMALE ? 'Nữ' : 'Khác',
    },
    { value: phone },
    {
      value:
        userRole === UserRole.ADMIN ? 'Admin' : userRole === UserRole.USER ? 'Người dùng' : 'Khác',
    },
  ]

  function deleteUser() {
    dispatch({
      payload: { _id },
      type: DELETE_USER,
    })
  }

  function updateUserScore() {
    toastServices.prompt({
      content: 'Nhập điểm',
      onConfirm: (score) => {
        dispatch({
          payload: { _id, score: +score },
          type: UPDATE_USER_SCORE,
        })
      },
      showPrompt: true,
    })
  }

  return (
    <tr onClick={() => showDetail(item?._id)}>
      {display.map((item, index) => (
        <td className='align-middle' key={index}>
          <span className='fw-normal'>{item.value}</span>
        </td>
      ))}

      <td className='align-middle'>
        <Dropdown
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Dropdown.Toggle variant='outline-dark' />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => editItem(item)}>{'Sửa thông tin'}</Dropdown.Item>
            <Dropdown.Item onClick={() => deleteUser()}>{'Xóa người dùng'}</Dropdown.Item>
            <Dropdown.Item onClick={() => updateUserScore()}>{'Cộng điểm'}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  )
}
