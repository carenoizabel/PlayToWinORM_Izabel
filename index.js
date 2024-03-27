require("dotenv").config();
const conn = require("./db/conn");

conn
.sync()
.then(() => {
    console.log("Conectado e sincronizado");
})
.catch((err) => {
    console.log("Ocorreu um erro: " + err);
})
const express = require("express");
const app = express();

app.use(
    express.urlencoded({
        extend: true,
    })
);
app.use(express.json());

app.get("/usuarios/novo", (req, res) => {
    res.sendFile(`${_dirname}/views/formUsuario.html`);
});