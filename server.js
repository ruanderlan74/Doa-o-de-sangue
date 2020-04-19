const express = require("express")
const server = express()


/*Configurando o server para apresentar arquivos extras / estaticos*/
server.use(express.static('public'))

/*habilitar body do forms */
server.use(express.urlencoded({extended:true}))

/* configurando a conexão com bd*/
const Pool = require('pg').Pool
const bd = new Pool({
    user: 'postgres',
    password: '19074',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

/*Configuração de Template*/
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express:server
})


/*Apresentação da sala*/
server.get("/", function(req, res){
    bd.query("SELECT * FROM donors", function(err, result){
        
        if(err) {
            return res.send("Erro de banco de dados")
       }
        
        const donors = result.rows

        return res.render("index.html", { donors })
    })
    
})


/*pegando dados do forms de inscrição*/
server.post("/", function(req, res){
    const name  = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    /*Colocando valores no BD*/
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    
    const values =  [name, email, blood]

    bd.query(query, values, function(err){
    
        if (err) return res.send("erro no banco de dados.")          
    
    })

    return res.redirect("/")
})


/*ligar o Serve*/
server.listen(3000, function(){
    console.log("Tá on")
})