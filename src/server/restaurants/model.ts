import { Restaurant } from '../../entities'

export interface CreateRestaurant {
  name: string
  description: string
}

export class RestaurantModel {
  public id?: number
  public name: string
  public description: string
  public done: boolean
  public created: Date
  public updated: Date

  constructor(restaurant: Restaurant) {
    this.id = restaurant.id
    this.name = restaurant.name
    this.description = restaurant.description
    this.done = restaurant.done
    this.created = restaurant.created
    this.updated = restaurant.updated
  }
}
