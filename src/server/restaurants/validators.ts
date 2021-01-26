import * as Joi from 'joi'

export const updateRestaurant: Joi.SchemaMap = {
  blurhash: Joi.string().required(),
  location: Joi.array()
    .length(2)
    .items(Joi.number().required()),
  name: Joi.string().required(),
  online: Joi.boolean().required(),
  launch_date: Joi.date().required(),
  popularity: Joi.number().required()
}

export const createRestaurant: Joi.SchemaMap = {
  blurhash: Joi.string().required(),
  location: Joi.array()
    .length(2)
    .items(Joi.number().required()),
  name: Joi.string().required(),
  online: Joi.boolean().required(),
  launch_date: Joi.date().required(),
  popularity: Joi.number().required()
}

export const createRestaurants: Joi.SchemaMap = {
  restaurants: Joi.array().items(createRestaurant)
}
