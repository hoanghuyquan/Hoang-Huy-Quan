import { persistReducer, persistStore } from 'redux-persist'
import { useDispatch, useSelector } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { rootReducer } from './rootReducer'
import { rootSaga } from './rootSaga'
import storage from 'redux-persist/lib/storage'

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware, logger]

const persistConfig = {
  key: process.env.REACT_APP_PERSIST_KEY || '',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middleware),
  reducer: persistedReducer,
})

export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export const useAppSelector = useSelector.withTypes<RootState>()
