const { disconnect } = require('process');

const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

var usuarios = []
var socketIds = []

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {

  socket.on('new user',(data)=>{
    if(usuarios.indexOf(data) != -1){
      socket.emit('new user', {sucess: false})
    }else{
      usuarios.push(data)
      socketIds.push(socket.id)
      socket.emit('new user',{sucess:true})
    }
  })
  socket.on('chat message',(obj)=>{
    if(usuarios.indexOf(obj.name) && usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)){
      io.emit('chat message',obj)
    }else{
      console.log("Erro: você não tem permissão para executara a acao")
    }
  })
  
  socket.on('disconnect',()=>{
    let id = socketIds.indexOf(socket.id)
    socketIds.splice(id,1)
    usuarios.splice(id,1)
    console.log(socketIds)
    console.log(usuarios)
    console.log("user disconnec ")
  })
})

http.listen(5000,()=>{
    console.log('funcionnado')
})