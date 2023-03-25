const http = require('http');
const fs = require('fs')

const hostname = "127.0.0.1";
const port = 3000;
/*criar novo arquivo*/
fs.writeFile('yuri.txt','teste yuri...',(err)=>{
    if(err) throw err;
    console.log("o arquivo foi criado com sucesso!")
})
//cria arquivo ou insere conteudo se ja existir o arquivo
/*fs.appendFile('yuri.txt','\noutro conteudo adicional',(err)=>{
    if(err) throw err;
    console.log('salvo com sucesso')
})*/

const server = http.createServer((req,res)=>{
    if(req.url == '/yuri'){
        fs.appendFile('yuri.txt','\noutro conteudo adicional',(err)=>{
            if(err) throw err;
            console.log('salvo com sucesso')
        })

        fs.readFile('index.html',(err,data)=>{
            res.writeHead(200,{'Content-type':'text/html'})
            res.write(data)
            return res.end()
        })       
        }else{
            return res.end()
    }
})

server.listen(port,hostname,()=>{
    console.log('rodando')
})