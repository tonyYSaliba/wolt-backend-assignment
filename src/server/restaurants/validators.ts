import * as Joi from 'joi'

export const updateRestaurant: Joi.SchemaMap = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  done: Joi.boolean().required()
}

export const createRestaurant: Joi.SchemaMap = {
  name: Joi.string().required(),
  description: Joi.string().required()
}
