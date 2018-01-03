const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const Immutable = require('immutable')
const { Observable } = require('rxjs')
const cors = require('cors')

//initalize our application
const app = express()
// add cors middleware
app.use(cors())

// setup body parser middleware for json
app.use(bodyParser.json())
// create a server using express app
const server = http.createServer(app)
// initialize socket io with server
const io = socketio(server)

// user list of connected clients
const userList = new Map()

// socket logic on connect
const sourceConnect = Observable.create(observer => {
  io.on('connection', socket => {
    socket.emit('my socketId', { socketId: socket.id, connectTime: Date.now() })
    socket.on('client connect', data => {
      observer.next({ socket: socket, data: data, event: 'client connect' })
    })
  })
})

sourceConnect.subscribe(obj => {
  userList.set(obj.data.socketId, obj.data)
  io.emit('all users', Array.from(userList).map(([key, value]) => value))
})

// socket logic on disconnect
const sourceDisconnect = Observable.create(observer => {
  io.on('connection', socket => {
    socket.on('disconnect', data => {
      observer.next({ socketId: socket.id, event: 'client disconnect' })
    })
  })
})

sourceDisconnect.subscribe(obj => {
  userList.delete(obj.socketId)
  io.emit('all users', Array.from(userList).map(([key, value]) => value))
})

//socket logic for post message
app.post('/message', (req, res) => {
  io.emit('message', req.body)
})

// demo routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  const name = req.body.name
  res.send(`Hello! ${name}`)
})

// 404 error
app.use((req, res, next) => {
  const err = new Error('Sorry!! route not found')
  err.status = 404
  next(err)
})

// Internal Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || { err: 'internal server error' })
})

//start our server
server.listen(4000, () => {
  console.log('rx chat server running at port 4000')
})
