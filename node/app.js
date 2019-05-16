import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import passport from 'passport'
import cors from 'cors'
import routes from './routes'

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}

const app = express()

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(passport.initialize())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(routes)

app.get('/', (req, res) => {
  res.send('Hello world')
})

export default app
