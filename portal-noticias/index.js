const express = require('express')
const mongoose = require('mongoose')
const fileoupload = require('express-fileupload')
const bodyParser = require('body-parser')
const fs = require('fs')

const path = require('path')
const app = express()

const Posts = require('./Posts') 
var session = require('express-session')
const { query } = require('express')
const fileUpload = require('express-fileupload')

mongoose.connect('mongodb+srv://root:iruysousa@cluster0.dceitcl.mongodb.net/ipsumNews?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{
    console.log("conectado com sucesso!")
}).catch((err)=>{
    console.log(err.message)
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname,'temp')
}));

app.use(session({secret: 'keyboard cat', cookie: {maxAge:60000}
  }))

app.engine("html",require('ejs').renderFile)
app.set('view engine','html')
app.use('/public', express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'/pages'))

var deployPath = 'https://ipsumnews.vercel.app/'
app.get('/',(req,res)=>{
    
    if(req.query.busca == null){
        Posts.find({}).sort({'_id':-1}).then(function(posts){
            posts = posts.map((val)=>{
                return {
                    titulo: val.titulo,
                    tituloCurto: val.titulo.substr(0,30),
                    conteudo : val.conteudo,
                    descricaoCurta : val.conteudo.substr(0,100),
                    imagem : val.imagem,
                    slug : val.slug,
                    categoria : val.categoria,
                    author : val.author.toUpperCase(),
                    views : val.views
                    
                }
            })
        
        Posts.find({}).sort({'views':-1}).limit(3).then(function(postsTop){
            postsTop = postsTop.map((val)=>{
                return {
                    titulo: val.titulo,
                    tituloCurto: val.titulo.substr(0,50),
                    conteudo : val.conteudo,
                    descricaoCurta : val.conteudo.substr(0,100),
                    imagem : val.imagem,
                    slug : val.slug,
                    categoria : val.categoria,
                    author : val.author,
                    views : val.views
                    
                }
            }
            )
        res.render('home',{posts:posts, postsTop:postsTop})
        })
        }).catch(function(err){
            console.log(err)
        })
               
        
        
        /*Posts.find({}).sort({'_id':-1}).exec(function(err,posts){
            console.log(posts[0])
        })*/
        
    }else{
        Posts.find({titulo: {$regex: req.query.busca, $options: "i"}}).then(function(posts){

            res.render('busca',{posts:posts})
        })
        

    }
    
})

app.get('/:slug', async (req, res) => {
    try {
      const resposta = await Posts.findOneAndUpdate({slug: req.params.slug},{$inc: {views: 1}},{new: true});

      if(resposta != null){
            Posts.find({}).sort({'views':-1}).limit(3).then(function(postsTop){
                postsTop = postsTop.map((val)=>{
                    return {
                        titulo: val.titulo,
                        conteudo : val.conteudo,
                        descricaoCurta : val.conteudo.substr(0,100),
                        imagem : val.imagem,
                        slug : val.slug,
                        categoria : val.categoria,
                        author : val.autor,
                        views : val.views
                    
                    }
                })
                Posts.find({}).sort({'_id':-1}).then(function(posts){
                    posts = posts.map((val)=>{
                        return {
                            titulo: val.titulo,
                            tituloCurto: val.titulo.substr(0,30),
                            conteudo : val.conteudo,
                            descricaoCurta : val.conteudo.substr(0,100),
                            imagem : val.imagem,
                            slug : val.slug,
                            categoria : val.categoria,
                            author : val.author.toUpperCase(),
                            views : val.views
                            
                        }
                    })
                
            
            res.render('single', {noticia:resposta, postsTop:postsTop, posts:posts});
        })
            })
        }else{
            res.render('erro',{})
        }
      
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro interno do servidor');
    }
  });
  
var usuarios = [{
    login:'yuri',
    senha:'1234',
}]
    
app.post("/admin/login",(req,res)=>{
    usuarios.map((val)=>{
        if(val.login ==req.body.login && val.senha == req.body.senha){
            req.session.login = 'yuri'
            
        }
        res.redirect('/admin/login')
    })
})

app.post('/admin/cadastro',(req,res)=>{
    //inserir no banco de daddos

    let formato = req.files.arquivo.name.split('.');
    var imagem = ""
    
    if(['png','jpg','jpeg'].includes(formato[formato.length -1])){
        imagem = new Date().getTime()+formato[formato.length -1]
        req.files.arquivo.mv(__dirname+'/public/images/'+imagem)
    }else{
        fs.unlinkSync(req.files.arquivo.tempFilePath)
    }

    Posts.create({
        titulo: req.body.titulo_noticia,
        imagem: deployPath+'/public/images'+imagem,
        categoria: req.body.categoria,
        conteudo:req.body.noticia,
        slug: ((req.body.titulo_noticia).split(" ")).join("-"),
        author: usuarios[0].login,
        views: 0
        //a.join ('|'));
    })
    res.redirect('/admin/login')
})

app.get('/admin/deletar/:id',(req,res)=>{
    Posts.deleteOne({_id:req.params.id}).then(()=>{
        res.redirect('/admin/login')
    })
})

app.get('/admin/login',(req,res)=>{
    if(req.session.login == null){
        res.render('admin-login')
    }else{
        Posts.find({}).sort({'_id':-1}).then(function(posts){
            posts = posts.map((val)=>{
                return {
                    id: val._id,
                    titulo: val.titulo,
                    tituloCurto: val.titulo.substr(0,30),
                    conteudo : val.conteudo,
                    descricaoCurta : val.conteudo.substr(0,100),
                    imagem : val.imagem,
                    slug : val.slug,
                    categoria : val.categoria,
                    author : val.author.toUpperCase(),
                    views : val.views
                    
                }
            })
        
        res.render('admin-painel',{posts:posts})
        })
    }
    
})

app.listen(5000,()=>{
    console.log('rodando')
})