require("dotenv").config();
const express = require("express");
const app = express();
const rotas = require("./routes");
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(rotas);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
