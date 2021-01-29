import * as moment from 'moment'
import { Restaurant } from '../../entities'

export interface CreateRestaurant {
  id?: number
  blurhash: string
  location: [number, number]
  name: string
  online: boolean
  launch_date: Date
  popularity: number
}

export class RestaurantModel {
  public id?: number
  public blurhash: string
  public location: [number, number]
  public name: string
  public online: boolean
  // tslint:disable-next-line: variable-name
  public launch_date: string
  public popularity: number
  // public created: Date
  // public updated: Date

  constructor(restaurant: Restaurant) {
    this.id = restaurant.id
    this.blurhash = restaurant.blurhash
    this.location = restaurant.location
    this.name = restaurant.name
    this.online = restaurant.online
    this.launch_date = moment(restaurant.launch_date).format('YYYY-MM-DD')
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
