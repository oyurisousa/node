const express = require('express')
const path = require('path')
const app = express()

app.engine("html",require('ejs').renderFile)
app.set('view engine','html')
app.use('/public', express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'/views'))

//traçando rota inicial
app.get('/',(req,res)=>{
    res.render('index',{nome:'yuri'})
})
//montando servidor
app.listen(5000,()=>{
    console.log('rodando')
})

