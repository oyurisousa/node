const fs = require('fs')


fs.readFile('yuri.txt',(err,data)=>{
    let str = (data.toString())

    //let newStr = str.split('/')
    let newStr = str.substring(0,7)
    
    console.log(newStr)

})