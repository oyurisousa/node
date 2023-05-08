const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    
    socket.broadcast.emit('novo usuario','um novo usuario')

    socket.on('disconnect', () => {
      console.log('desconectado');
    });
  });

http.listen(5000,()=>{
    console.log('funcionnado')
})