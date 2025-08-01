const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const contaController = require("../controllers/contaController");
const {
  autenticarToken,
  verificarAdmin,
} = require("../middlewares/authMiddleware");

router.post("/cadastro", authController.cadastrar);
router.post("/login", authController.login);
router.get(
  "/admin/contas",
  autenticarToken,
  verificarAdmin,
  contaController.listarContas
);

module.exports = router;
