const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// define que algum hook seja realizado ANTES da ação
// usa o "async function" porque o mongoose já fornece os dados do usuário através do (this)
UserSchema.pre('save', async function (next) {
  // se o password não foi modificado então prossegue o fluxo
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 8)
})

// aqui deve estar todos os métodos que a instância de usuário deve possuir
UserSchema.methods = {
  // método que vai comparar a senha informada(frontend) com a senha do objeto encontrado
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

// aqui deve estar os métodos estáticos, ou seja, que não precisam de instanciação
UserSchema.statics = {
  generateToken ({ id }) {
    // o segundo é parâmetro "SECRET", deve algo único da aplicação
    // para que o Token não seja válido em outra aplicação que utilize JWT
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl
    })
  }
}

module.exports = mongoose.model('User', UserSchema)
