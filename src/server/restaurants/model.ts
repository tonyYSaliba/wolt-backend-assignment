import { Restaurant } from '../../entities'

export interface CreateRestaurant {
  name: string
  description: string
}

export class RestaurantModel {
  public id?: number
  public blurhash: string
  public location: [number, number]
  public name: string
  public online: boolean
  public launchDate: Date
  public popularity: number
  // public created: Date
  // public updated: Date

  constructor(restaurant: Restaurant) {
    this.id = restaurant.id
    this.blurhash = restaurant.blurhash
    this.location = restaurant.location
    this.name = restaurant.name
    this.online = restaurant.online
    this.launchDate = restaurant.launch_date
    this.popularity = restaurant.popularity
    // this.created = restaurant.created
    // this.updated = restaurant.updated
  }
}

export class RestaurantSectionModel {
  public title: string
  public restaurants: RestaurantModel[]

  constructor(title: string) {
    this.title = title
  }
}
export class RestaurantDiscoveryModel {
  public sections: RestaurantSectionModel[]

  constructor() {
    this.sections = []
  }
}
