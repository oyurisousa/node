const fs = require('fs')


fs.readFile('yuri.txt',(err,data)=>{
    console.log(data.toString())
})