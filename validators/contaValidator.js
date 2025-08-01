const Joi = require("joi");

const cadastroSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  nome_usuario: Joi.string().required(),
  is_admin: Joi.boolean(),

  nome_completo: Joi.string().required(),
  data_nascimento: Joi.date().required(),
  rg: Joi.string().required(),
  cpf: Joi.string().length(14).required(),
  cargo_atual: Joi.string().required(),
  salario_atual: Joi.number().required(),
  regime_atual: Joi.string().required(),
  tempo_atuacao: Joi.number().integer().required(),
  localidade: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
});

module.exports = { cadastroSchema, loginSchema };
