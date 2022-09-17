//Instalar os módulos
//npm install nodemon express express-handlebars mysql

//Estrutura básica da aplicação
const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//midleware para interpretar os dados do formulário POST
app.use(
    express.urlencoded({
        extended : true
    })
)

app.use(express.json())

//midleware para definir a pasta estática 'pública'
app.use(express.static('public'))

//Rota inicial
app.get('/', function(req,res){
    res.render('home')
})

//Rota para receber os dados do formulário cadastrar panquecas
app.post('/panquecas/insertpanqueca', function(req,res){
    const nome = req.body.nome
    let egg = parseInt(req.body.ovo)
    let flour = parseInt(req.body.trigo)
    let milk = parseInt(req.body.leite)
    const nomep = req.body.nomep

    if (egg >= 1 && flour >= 100 && milk >= 200){
        flour = Math.floor(flour/100)
        milk = Math.floor(milk/200)
        const smallest = Math.min(flour,milk,egg);
        panquecas = smallest * 4;

        const sql = `INSERT INTO estoque (nome,ovos,leite,trigo,nomep, panquecas) VALUES ('${nome}','${egg}',${flour}, '${milk}','${nomep}', '${panquecas}');`
    
        pool.query(sql, function(err){
            if (err){
                console.log(err)
            }
    
            res.redirect('/')
        })
    }else{
        res.redirect('/')
    }

})

//Rota para listar todas as panquecas
app.get('/panquecas', function(req,res){
    const sql = "SELECT * FROM estoque;"
    pool.query(sql, function(err,data){
        if (err){
            console.log(err)
        }

        res.render('panquecas', {estoque:data})
    })
})

//Rota para listar uma panqueca específica
app.get('/panqueca/:id',function(req,res){
    const id = req.params.id
    const sql = `SELECT * FROM estoque WHERE id = ${id}`
    pool.query(sql, function (err,data){
        if (err){
            console.log(err)
        }
        const estoque = data[0]
        res.render('panqueca', {estoque: estoque})
    })
})

//Rota para editar a panqueca
app.get('/panquecas/edit/:id',function(req,res){
    const id = req.params.id
    const sql = `SELECT * FROM estoque WHERE id = ${id}`
        pool.query(sql,function(err,data){
            if (err){
                console.log(err)
            }
            const estoque = data[0]

            res.render('editpanquecas',{estoque:estoque})
        })
})

//Rota para receber os dados atualizados da panqueca
app.post('/panquecas/updatepanqueca', function(req,res){
    const id = req.body.id
    const nome = req.body.nome
    let egg = req.body.ovo
    let milk = req.body.leite
    let flour = req.body.trigo
    const nomep = req.body.nomep

    if (egg >= 1 && flour >= 100 && milk >= 200){
        flour = Math.floor(flour/100)
        milk = Math.floor(milk/200)
        const smallest = Math.min(flour,milk,egg);
        panquecas = smallest * 4;

    const sql = `UPDATE estoque SET nome='${nome}', ovos='${egg}',  leite ='${milk}', trigo='${flour}', nomep='${nomep}', panquecas='${panquecas}' WHERE id = ${id}`
    pool.query(sql,function(err){
        if (err){
            console.log(err)
        }
        res.redirect(`/panqueca/${id}`)
    })
}else{
    res.redirect(`/panqueca/${id}`)
}
})

//Rota para excluir a panqueca
app.post('/panquecas/remove/:id', function(req,res){
    const id = req.params.id
    const sql = `DELETE FROM estoque WHERE id = ${id}`
    pool.query(sql,function(err){
        if (err){
            console.log(err)
        }
        res.redirect(`/panquecas`)
    })
})

app.listen(3000)