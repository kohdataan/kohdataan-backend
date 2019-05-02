/* eslint-disable no-console */
import http from 'http'
import debug from 'debug'
import app from './app'

debug('docker_web_app:server')

const normalizePort = val => {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

const port = normalizePort(process.env.PORT || '8080')
app.set('port', port)

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Portis ${port}`

  switch (error.code) {
    case 'EACCES':
      console.log(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  debug(`Listening on ${bind}`)
}
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
