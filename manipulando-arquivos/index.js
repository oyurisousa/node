const fs = require('fs')


fs.rename('yuri.txt','yurirnm',(err)=>{
    console.log('arquivo foi renomeado com sucessso')
})