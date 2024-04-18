require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");

const express = require("express");
const app = express();

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
    res.sendFile(`${__dirname}/views/formUsuario.html`);
});

app.post("/usuarios/novo", async (req, res) => {
    const nickname = req.body.nickname;
    const nome = req.body.nome;

    const dadosUsuario = {
        nickname,
        nome,
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

    res.send("Jogo cadastrado com sucesso! Código: " + jogo.id);
});

app.get("/cadastrarjogo", (req, res) => {
    res.sendFile(`${__dirname}/views/formJogo.html`);
});

app.listen(8000, () =>{
    console.log("Server rodando na porta 8000!")
})