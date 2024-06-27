require("dotenv").config();
const conn = require("./db/conn");
const exphbs = require("express-handlebars");
const express = require("express");

const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Jogo = require("./models/Jogo");

Jogo.belongsToMany(Usuario, { through: "aquisicoes" });
Usuario.belongsToMany(Jogo, { through: "aquisicoes" });

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

conn
.sync()
.then(() => {
    console.log("Conectado e sincronizado");
})
.catch((err) => {
    console.log("Ocorreu um erro: " + err);
})

app.use(express.json());

app.get("/usuarios/novo", (req, res) => {
    res.render('formUsuario')
});

app.get("/", (req, res) => {
    res.render('home')
});

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll({raw: true})
    res.render('usuarios', { usuarios});
});

app.post("/usuarios/novo", async (req, res) => {
    const dadosUsuario = {
      nickname: req.body.nickname,
      nome: req.body.nome,
    };
  
    const usuario = await Usuario.create(dadosUsuario);
    res.send("Usuário inserido sob o id " + usuario.id);
  });

app.post("/cadastrarjogo", async (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const precoBase = req.body.precoBase;

    const dadosJogo = {
        titulo,
        descricao,
        precoBase
    };

    const jogo = await Jogo.create(dadosJogo);

    res.redirect(`/cadastrarJogo`);
});

app.get("/cadastrarJogo", (req, res) => {
    res.render('formJogo')
});

app.get("/usuarios/:id/atualizar", async (req, res) => {
    {
        const id = req.params.id;
        const usuario = await Usuario.findByPk(id, { raw: true });
        res.render('formUsuario', { usuario })
    }
})

app.post("/usuarios/:id/atualizar", async (req, res) => {
        const id = req.params.id;

        const dadosUsuarios = {
        nickname: req.body.nickname,
        nome: req.body.nome
    }

    const registrosAfetados = await Usuario.update(dadosUsuarios, { where:{ id: id}});
    if (registrosAfetados > 0) {
        res.redirect("/usuarios");

    } else{
        res.send("Erro ao atualizar usuário!")
    }
})

app.post("/usuarios/:id/excluir", async(req, res) => {

    const id = parseInt(req.params.id);
    
    const registrosAfetados = await Usuario.destroy({ where:{ id: id}});
    if (registrosAfetados > 0) {
        res.redirect("/usuarios");

    } else{
        res.send("Erro ao excluir usuário!")
    }
})

// Rotas para cartões

//Ver cartões do usuário
app.get("/usuarios/:id/cartoes", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });
  
    const cartoes = await Cartao.findAll({
      raw: true,
      where: { UsuarioId: id },
    });
  
    res.render("cartoes.handlebars", { usuario, cartoes });
  });
  
  //Formulário de cadastro de cartão
  app.get("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });
  
    res.render("formCartao", { usuario });
  });
  
  //Cadastro de cartão
  app.post("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
  
    const dadosCartao = {
      numero: req.body.numero,
      nome: req.body.nome,
      codSeguranca: req.body.codSeguranca,
      UsuarioId: id,
    };
  
    await Cartao.create(dadosCartao);
  
    res.redirect(`/usuarios/${id}/cartoes`);
  });

app.listen(8000, () =>{
    console.log("Server rodando na porta 8000!")
})