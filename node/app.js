import express from 'express'
import { Client4 } from 'mattermost-redux/client'
import routes from './routes'

Client4.setUrl('http://mattermost:8000')

const app = express()

app.use(routes)

app.get('/', (req, res) => {
  res.send('Hello world')
})

export default app
