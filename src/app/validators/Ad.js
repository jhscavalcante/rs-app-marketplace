const Joi = require('joi')

module.exports = {
  // query  => podemos validar
  // params => podemos validar

  body: {
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()
  }
}
