const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cadastroSchema, loginSchema } = require("../validators/contaValidator");

exports.cadastrar = async (req, res) => {
  try {
    const { error } = cadastroSchema.validate(req.body);
    if (error) return res.status(400).json({ erro: error.details[0].message });

    const {
      email,
      senha,
      nome_usuario,
      is_admin = false,
      nome_completo,
      data_nascimento,
      rg,
      cpf,
      cargo_atual,
      salario_atual,
      regime_atual,
      tempo_atuacao,
      localidade,
    } = req.body;

    // Verificar se e-mail ou nome_usuario já existem
    const existe = await pool.query(
      "SELECT 1 FROM users WHERE email = $1 OR nome_usuario = $2",
      [email, nome_usuario]
    );
    if (existe.rows.length > 0)
      return res.status(400).json({ erro: "Usuário já cadastrado" });

    // Criar usuário
    const hash = await bcrypt.hash(senha, 10);
    const novoUser = await pool.query(
      "INSERT INTO users (email, senha, nome_usuario, is_admin) VALUES ($1, $2, $3, $4) RETURNING id",
      [email, hash, nome_usuario, is_admin]
    );
    const userId = novoUser.rows[0].id;

    // Criar conta PF vinculada ao usuário
    await pool.query(
      `INSERT INTO contas_pf (
        user_id, nome_completo, data_nascimento, rg, cpf,
        cargo_atual, salario_atual, regime_atual, tempo_atuacao, localidade
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        userId,
        nome_completo,
        data_nascimento,
        rg,
        cpf,
        cargo_atual,
        salario_atual,
        regime_atual,
        tempo_atuacao,
        localidade,
      ]
    );

    // Se for admin, cadastrar na tabela adm
    if (is_admin) {
      await pool.query(
        "INSERT INTO adm (user_id, setor, permissao_geral) VALUES ($1, $2, $3)",
        [userId, "Geral", true]
      );
    }

    res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ erro: error.details[0].message });

    const { email, senha } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.status(401).json({ erro: "Email ou senha inválidos" });

    const valid = await bcrypt.compare(senha, user.rows[0].senha);
    if (!valid)
      return res.status(401).json({ erro: "Email ou senha inválidos" });

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        nome_usuario: user.rows[0].nome_usuario,
        is_admin: user.rows[0].is_admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};
