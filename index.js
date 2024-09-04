const express = require("express"); //importando modulo express
const app = express(); // criando instancia do express


const bodyParser = require('body-parser')

const connection = require('./database/database')

const perguntaModel = require('./database/pergunta');

const respostaModel = require('./database/resposta');

const pergunta = require("./database/pergunta");

const { where } = require("sequelize");
const resposta = require("./database/resposta");

//Banco de dados
connection.
      authenticate().
      then(()=>{
         console.log("Conectado ao banco de dados!")
      })
      .catch((msgErro)=>{
         console.log("msgErro")
      })

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Usar EJS como View Engine - renderizador de HTML  
app.set('view engine','ejs')

app.use(express.static('public'))

app.post("/savequestion", (req,res) =>{
   var titulo = req.body.titulo
   var descricao = req.body.descricao   

   //res.send("Formulário recebido! Titulo: " + titulo + " com descrição " +descricao)

   perguntaModel.create({
      titulo: titulo,
      descricao: descricao
   }).then(()=>{
      res.redirect('/')
   })
})

app.get('/question', (req,res) =>{
   res.render('question')
})

app.get("/question/:id", (req,res)=>{
   var id = req.params.id

   perguntaModel.findOne({
      where: {id:id}
   }).then(pergunta => {
      if (pergunta != undefined) {
         respostaModel.findAll({
            where: {perguntaId: pergunta.id},
            order: [['id','DESC']]            
         }).then(resposta => {                                   
            res.render('detalhesperguntas',{
               pergunta:pergunta,
               resposta:resposta                            
         })
            
         })

      }else{
         res.redirect('/')
      }
   })   
});

app.post('/responder',(req,res)=>{
   var corpo = req.body.corpo
   var perguntaId = req.body.pergunta  
   respostaModel.create({      
      corpo:corpo,
      perguntaId:perguntaId
   }).then(()=>{
      res.redirect('/question/'+perguntaId)
   })
})

app.get('/resposta/delete/:id',(req,res)=>{
   var id = req.params.id
   respostaModel.destroy({
      where: {
         id:id
      }
   }).then(()=>{
      res.redirect('back')
   })
})

app.get("/",(req,res)=>{
   //select * from perguntas
   
   perguntaModel.findAll({raw:true}).then(pergunta =>{
      res.render('index',{
         pergunta:pergunta
      })
   })
   
})
 
app.listen("8181",()=> { 
   console.log("Servidor online!")
}); 
