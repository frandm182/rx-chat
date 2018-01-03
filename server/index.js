const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const Immutable = require('immutable')
const { Observable } = require('rxjs')

//Initialize aplication
const app = express()

//Setup body parser middleware
app.use(bodyParser.json())

// create a server using express
const server = http.createServer(app)

//Initialize socket io with server
const io = socketio(server)

const usersList = Immutable.Map({});

//socket logic on connect

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
    io.emit('all users', userList.toArray())
})

//socket logic for post message
app.post('/message', (req,res) => {
    io.emit('message', req.body)
})

//socket logic on disconnect
const sourceDisconnect = Observable.create(observer => {
     io.on('connection', socket => {         
       socket.on('client connect', data => {
        observer.next({ socketId: socket.id, event: 'client disconnect' })
       })
    })
})

sourceDisconnect.subscribe(obj => {
    userList.delete(obj.socketId)
    io.emit('all users', userList.toArray())
})

//http://localhost:4000
app.get('/', (req,res) => {
    res.send('Hello world')
})

//http://localhost:4000
app.post('/', (req,res) => {
    const name = req.body.name
    res.send(`Hello! ${name}`)
})

//start server
server.listen(4000,() => {
    console.log('rx server running in port 4000')
})
