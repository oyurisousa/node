const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {

  socket.on('chat message',(obj)=>{
    console.log(obj)
  })
})

http.listen(5000,()=>{
    console.log('funcionnado')
})