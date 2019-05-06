const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    // se o usuário não existe
    if (!user) {
      return res.status(400).json({ error: 'User not found ' })
    }

    // se as senhas não forem iguais return: false
    // se (!false) => true
    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Invalid password ' })
    }

    // vai retornar para o frontend { user e token }
    return res.json({ user, token: User.generateToken(user) })
  }
}

module.exports = new SessionController()
