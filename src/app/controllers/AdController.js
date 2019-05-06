const Ad = require('../models/Ad')

class AdController {
  async index (req, res) {
    const filters = {}

    // $gte (maior ou igual) e $lte (menor ou igual) => são propriedade do mongoose
    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }

      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }

    // o "i" ignora se estiver em letras maiúsculas ou minúsculas
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i')
    }

    // 1° parãmetro: são os filtros
    // 2° parâmetro:
    // page: verifica se tem o valor na requisição, se não possuir será 1
    // limit: total de registros por página
    // sort: order by decrescente, neste caso, por conta do "-"
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'],
      sort: '-createdAt'
    })

    return res.json(ads)
  }

  async show (req, res) {
    const ad = await Ad.findById(req.params.id)

    return res.json(ad)
  }

  async store (req, res) {
    const ad = await Ad.create({
      ...req.body,
      author: req.userId
    })

    return res.json(ad)
  }

  async update (req, res) {
    // new: true => atualiza os valores do objeto para ser retornado ao frontend
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(ad)
  }

  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)

    return res.send()
  }
}

module.exports = new AdController()
