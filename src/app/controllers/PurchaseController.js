const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    // busca o anúncio(pelo id) e as informações do author do anúncio
    const purchaseAd = await Ad.findById(ad).populate('author')

    // busca as informações do usuário logado
    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({
      content,
      user: user._id,
      ad
    })

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()
    // o save => é para salvar no redis e executar na fila

    return res.json(purchase)
  }

  async acceptPurchaseIntention (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    // O anúncio só pode ser aceito pelo próprio autor
    if (!ad.author._id.equals(req.userId)) {
      return res.status(401).json({ error: 'Você não é o autor do anúncio' })
    }

    // se o campo purchasedBy existir é porque já foi aceito
    if (ad.purchasedBy) {
      return res.status(401).json({ error: 'Este anúncio já foi aceito' })
    }

    ad.purchasedBy = id

    await ad.save()

    return res.json(ad)
  }
}

module.exports = new PurchaseController()
