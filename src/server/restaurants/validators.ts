import * as Joi from 'joi'

export const updateRestaurant: Joi.SchemaMap = {
  blurhash: Joi.string().required(),
  location: Joi.array().items(Joi.number().required(), Joi.number().required()),
  name: Joi.string().required(),
  online: Joi.boolean().required(),
  launchDate: Joi.date().required(),
  popularity: Joi.number().required()
}

export const createRestaurant: Joi.SchemaMap = {
  blurhash: Joi.string().required(),
  location: Joi.array().items(Joi.number().required(), Joi.number().required()),
  name: Joi.string().required(),
  online: Joi.boolean().required(),
  launchDate: Joi.date().required(),
  popularity: Joi.number().required()
}
