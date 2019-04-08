const express = require('express')
const { Client4 } = require('mattermost-redux/client')
require('isomorphic-fetch')

// Constants
const PORT = 8080
const HOST = '0.0.0.0'
Client4.setUrl('http://mattermost:8000')

// App
const app = express()
app.get('/', (req, res) => {
  res.send('Hello world\n')
  Client4.login('exampleUsername', 'examplePassword')
  .then((me) => {
    console.log(me)
  })
  .catch((err) => {
    console.log(err)
  })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
