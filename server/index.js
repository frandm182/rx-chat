const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketio = require('socket.io')

//Initialize aplication
const app = express()

//Setup body parser middleware
app.use(bodyParser.json())

// create a server using express
const server = http.createServer(app)

//Initialize socket io with server
const io = socketio(server)

//socket logic on connect

//socket logic for post message
app.post('/message', (req,res) => {
    io.emit('message', req.body)
})

//socket logic on disconnect


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
