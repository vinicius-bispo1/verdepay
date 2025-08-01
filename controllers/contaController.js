const pool = require("../config/db");

exports.listarContas = async (req, res) => {
  try {
    const contas = await pool.query(`
      SELECT 
        contas_pf.nome_completo, 
        users.nome_usuario, 
        contas_pf.salario_atual 
      FROM contas_pf
      JOIN users ON contas_pf.user_id = users.id
    `);

    res.json(contas.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar contas" });
  }
};
