const jwt = require("jsonwebtoken");
require("dotenv").config();

function autenticarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensagem: "Token inválido" });
    req.user = user;
    next();
  });
}

function verificarAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res
      .status(403)
      .json({ mensagem: "Acesso negado: apenas administradores" });
  }
  next();
}

module.exports = { autenticarToken, verificarAdmin };
