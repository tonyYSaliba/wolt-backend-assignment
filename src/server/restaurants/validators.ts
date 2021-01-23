import * as Joi from 'joi'

export const updateRestaurant: Joi.SchemaMap = {
  blurhash: Joi.string().required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  name: Joi.string().required(),
  online: Joi.boolean().required(),
  launchDate: Joi.date().required(),
  popularity: Joi.number().required()
}

export const createRestaurant: Joi.SchemaMap = {
  blurhash: Joi.string().required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  name: Joi.string().required(),
  online: Joi.boolean().required(),
  launchDate: Joi.date().required(),
  popularity: Joi.number().required()
}
