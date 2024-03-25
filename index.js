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