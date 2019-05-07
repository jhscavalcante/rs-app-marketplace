const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    // busca o anúncio e as informações do anúncio e do author do anúncio
    const purchaseAd = await Ad.findById(ad).populate('author')

    // busca as informações do usuário logado
    const user = await User.findById(req.userId)

    await Mail.sendMail({
      from: '',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra: ${purchaseAd.title}`,
      template: 'purchase',
      context: { user, content, ad: purchaseAd }
    })

    return res.send()
  }
}

module.exports = new PurchaseController()
