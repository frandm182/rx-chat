const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

//Initialize aplication
const app = express();

//Setup body parser middleware
app.use(bodyParser.json());

// create a server using express
const server = http.createServer(app);

//http://localhost:4000
app.get('/', (req,res) => {
    res.send('Hello world');
})

//http://localhost:4000
app.post('/', (req,res) => {
    const name = req.body.name;
    res.send(`Hello! ${name}`);
})

//start server
server.listen(4000,() => {
    console.log('rx server running in port 4000');
})
