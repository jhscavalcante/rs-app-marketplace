const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  // se não existe o token no Header
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  // Authorization: Bearer token
  // separa a palavra "Bearer" do token, com base no espaçamento
  const [, token] = authHeader.split(' ')

  try {
    // vai ser retornado um objeto com o id do usuário
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    // cria uma variável na requisição com o valor do id
    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
