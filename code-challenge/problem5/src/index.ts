/* 
Develop a backend server with ExpressJS. You are required to build a set of CRUD interface that allow a user to interact with the service. You are required to use TypeScript for this task.

1. Interface functionalities:
   a. Create a resource.
   b. List resources with basic filters.
   c. Get details of a resource.
   d. Update resource details.
   e. Delete a resource.
2. You should connect your backend service with a simple database for data persistence.
3. Provide [`README.md`](http://README.md) for the configuration and the way to run application.
*/
import 'module-alias/register'

import { AdminRouteName, RouteName } from '~constants'
import { closeDb, connectDb } from '~utils'
import { en, vi } from '~localization'
import express, { Application } from 'express'
import { userAdminRoute, userRoute } from '~routes'

import bodyParser from 'body-parser'
import { config } from 'dotenv'
import cors from 'cors'
import i18n from 'i18n'

config()

const app: Application = express()
i18n.configure({
  defaultLocale: 'vi',
  locales: ['vi', 'en'],
  objectNotation: true,
  staticCatalog: { en, vi },
})

connectDb()
  .then(() => {
    app.use(i18n.init)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())

    app.use(RouteName.route, userRoute)
    app.use(AdminRouteName.route, userAdminRoute)

    app.listen(3000, () => {
      console.log('Server running on port 3000')
    })

    const env = process.env.ENV
    const port = process.env.PORT || 3000
    app.listen(port, async () => {
      console.log(`${env} - Server is running on port ${port}`)
    })
  })
  .catch((err: unknown) => {
    closeDb()
    console.error('ErrorConnectDb', err instanceof Error ? err.message : err)
  })
