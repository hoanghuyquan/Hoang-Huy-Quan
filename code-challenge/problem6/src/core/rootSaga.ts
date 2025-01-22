import { all, fork } from 'redux-saga/effects'
import {
  userProfileSaga,
  userSaga,
} from '~saga'

export function* rootSaga() {
  yield all([
    fork(userProfileSaga),
    fork(userSaga),
  ])
}
