import {
  userProfileReducer,
  userReducer,
} from '~redux'

import { combineReducers } from 'redux'

export const appReducer = combineReducers({
  user: userReducer,
  userProfile: userProfileReducer,
})

export const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
    return appReducer({}, action)
  }
  return appReducer(state, action)
}
