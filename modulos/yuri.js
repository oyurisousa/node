class Yuri{
    constructor(nome){
        this.nome = nome
        
        console.log(this.nome)
        
    }
    teste(){
        console.log('invocando teste');
    }
}


//var yuri  = new Yuri
//exports.classYuri = yuri //forma de exportar classe indiretamente
module.exports = Yuri // forma de exportar classe diretamente