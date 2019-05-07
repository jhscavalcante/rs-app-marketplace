const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    // busca o anúncio e as informações do anúncio e do author do anúncio
    const purchaseAd = await Ad.findById(ad).populate('author')

    // busca as informações do usuário logado
    const user = await User.findById(req.userId)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()
    // o save => é para salvar no redis e executar na fila

    return res.send()
  }
}

module.exports = new PurchaseController()
