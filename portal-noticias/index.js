const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const Posts = require('./Posts') 
var session = require('express-session')
const { query } = require('express')

mongoose.connect('mongodb+srv://root:iruysousa@cluster0.dceitcl.mongodb.net/ipsumNews?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{
    console.log("conectado com sucesso!")
}).catch((err)=>{
    console.log(err.message)
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({secret: 'keyboard cat', cookie: {maxAge:60000}
  }))

app.engine("html",require('ejs').renderFile)
app.set('view engine','html')
app.use('/public', express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'/pages'))


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
    console.log(req.body)
    Posts.create({
        titulo: req.body.titulo_noticia,
        imagem: req.body.url_noticia,
        categoria: 'nenhuma',
        conteudo:req.body.noticia,
        slug: req.body.slug,
        author: "admin",
        views: 0
    })
    res.send("cadastrado com sucesso!")
})

app.get('/admin/deletar/:id',(req,res)=>{
    res.send("deletado com sucesso a noticia: "+ req.params.id)
})

app.get('/admin/login',(req,res)=>{
    if(req.session.login == null){
        res.render('admin-login')
    }else{
        res.render('admin-painel',{})
    }
    
})

app.listen(5000,()=>{
    console.log('rodando')
})