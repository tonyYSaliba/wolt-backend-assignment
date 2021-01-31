import * as moment from 'moment'
import { Restaurant } from '../../entities'

export interface CreateRestaurant {
  id?: number
  blurhash: string
  location: [number, number]
  name: string
  online: boolean
  launch_date: string
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

  constructor(restaurant: Restaurant) {
    this.id = restaurant.id
    this.blurhash = restaurant.blurhash
    this.location = restaurant.location
    this.name = restaurant.name
    this.online = restaurant.online
    this.launch_date = moment(restaurant.launch_date).format('YYYY-MM-DD')
    this.popularity = restaurant.popularity
  }
}

export class RestaurantDiscoveryModel {
  public blurhash: string
  public location: [number, number]
  public name: string
  public online: boolean
  // tslint:disable-next-line: variable-name
  public launch_date: string
  public popularity: number

  constructor(restaurant: Restaurant) {
    this.blurhash = restaurant.blurhash
    this.location = restaurant.location
    this.name = restaurant.name
    this.online = restaurant.online
    this.launch_date = moment(restaurant.launch_date).format('YYYY-MM-DD')
    this.popularity = restaurant.popularity
  }
}
export class SectionModel {
  public title: string
  public restaurants: RestaurantDiscoveryModel[]

  constructor(title: string, restaurants: Restaurant[]) {
    this.title = title
    this.restaurants = restaurants.map(
      (r: Restaurant) => new RestaurantDiscoveryModel(r)
    )
  }
}
export class SectionsModel {
  public sections: SectionModel[]

  constructor() {
    this.sections = []
  }
}
