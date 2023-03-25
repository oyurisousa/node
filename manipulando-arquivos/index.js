const fs = require('fs')

//fs.unclick para deletar
fs.rename('yuri.txt','yurirnm',(err)=>{
    console.log('arquivo foi renomeado com sucessso')
})