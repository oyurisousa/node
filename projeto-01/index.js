const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.engine("html",require('ejs').renderFile)
app.set('view engine','html')
app.use('/public', express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'/views'))


var tarefas = ['varrer a casa','correr','cantar']
//traçando rota inicial</div>
app.get('/',(req,res)=>{
    
    res.render('index',{tarefas: tarefas})
})
app.post('/',(req,res)=>{
    console.log(tarefas[tarefas.length -1])

    tarefas.push(req.body.novaTarefa)
    res.render('index',{tarefas: tarefas})
})
app.post('/deletar/:id',(req,res)=>{
    tarefas.push(req.body.novaTarefa)
    res.render('index',{tarefas: tarefas})
})
app.get('/deletar/:id',(req,res)=>{
    tarefas.splice(req.params.id,1)
    res.render('index',{tarefas: tarefas})
})

//montando servidor
app.listen(5000,()=>{
    console.log('rodando')
})

