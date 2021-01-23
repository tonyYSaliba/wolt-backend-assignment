import { Restaurant } from '../../entities'

export interface CreateRestaurant {
  name: string
  description: string
}

export class RestaurantModel {
  public id?: number
  public blurhash: string
  public longitude: number
  public latitude: number
  public name: string
  public online: boolean
  public launchDate: Date
  public popularity: number
  public created: Date
  public updated: Date

  constructor(restaurant: Restaurant) {
    this.id = restaurant.id
    this.blurhash = restaurant.blurhash
    this.longitude = restaurant.longitude
    this.latitude = restaurant.latitude
    this.name = restaurant.name
    this.online = restaurant.online
    this.launchDate = restaurant.launchDate
    this.popularity = restaurant.popularity
    this.created = restaurant.created
    this.updated = restaurant.updated
  }
}
