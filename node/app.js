const express = require('express')
const request = require('request')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')

const { Client4 } = require('mattermost-redux/client')
require('isomorphic-fetch')

// Constants
const PORT = 8080
const HOST = '0.0.0.0'
Client4.setUrl('http://mattermost:8000')

// App
const app = express()

app.use(require('./routes'));

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

//app.listen(PORT, HOST)
/*app.set('port', PORT)
const server = http.createServer(app);
server.listen(PORT);

console.log(`Running on http://${HOST}:${PORT}`)*/

module.exports = app;
