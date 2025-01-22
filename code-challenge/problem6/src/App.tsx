import './App.css'

import { persistor, store } from '~core'

import { Loading } from '~components'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'react-bootstrap'
import { router } from '~screens'

console.log('ENV', process.env.REACT_APP_ENV, process.env)

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider dir='rtl'>
          <RouterProvider fallbackElement={<Loading isLoading />} router={router} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
