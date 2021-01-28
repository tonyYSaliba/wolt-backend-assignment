import { Context } from 'koa'
import { Restaurant } from '../../entities'
import { AuthUser } from '../../lib/authentication'
import { RestaurantManager } from '../../managers'
import {
  RestaurantDiscoveryModel,
  RestaurantModel,
  RestaurantSectionModel
} from './model'

export class RestaurantController {
  private manager: RestaurantManager

  constructor(manager: RestaurantManager) {
    this.manager = manager
  }

  public async get(ctx: Context) {
    // const authUser: AuthUser = ctx.state.user
    const restaurant = await this.manager.find(ctx.params.id)

    ctx.body = new RestaurantModel(restaurant)
    ctx.status = 200
  }

  public async discovery(ctx: Context) {
    const longitude = isNaN(ctx.query.lon) ? 0 : parseFloat(ctx.query.lon)
    const latitude = isNaN(ctx.query.lat) ? 0 : parseFloat(ctx.query.lat)
    const radius = 1500
    const limit = 10

    const restaurantDiscovery = new RestaurantDiscoveryModel()

    const restaurants = await this.manager.findByLowerRadiusOrderByPopularityAndOnline(
      longitude,
      latitude,
      radius,
      limit
    )
    const popularRestaurants = new RestaurantSectionModel('Popular Restaurants')
    popularRestaurants.restaurants = restaurants.map(
      (r: Restaurant) => new RestaurantModel(r)
    )
    restaurantDiscovery.sections.push(popularRestaurants)

    const date = new Date()
    date.setMonth(date.getMonth() - 4)
    const restaurants2 = await this.manager.findByLowerRadiusAndGreaterDateOrderByDateAndOnline(
      longitude,
      latitude,
      radius,
      date,
      limit
    )
    const newRestaurants = new RestaurantSectionModel('New Restaurants')
    newRestaurants.restaurants = restaurants2.map(
      (r: Restaurant) => new RestaurantModel(r)
    )
    restaurantDiscovery.sections.push(newRestaurants)

    const restaurants3 = await this.manager.findByLowerRadiusOrderByDistanceAndOnline(
      longitude,
      latitude,
      radius,
      limit
    )
    const nearbyRestaurants = new RestaurantSectionModel('Nearby Restaurants')
    nearbyRestaurants.restaurants = restaurants3.map(
      (r: Restaurant) => new RestaurantModel(r)
    )
    restaurantDiscovery.sections.push(nearbyRestaurants)

    ctx.body = restaurantDiscovery
    ctx.status = 200
  }

  public async create(ctx: Context) {
    const authUser: AuthUser = ctx.state.user
    const restaurant: Restaurant = ctx.request.body

    console.log(authUser.id)

    const newRestaurant = await this.manager.create(restaurant)

    ctx.body = new RestaurantModel(newRestaurant)
    ctx.status = 201
    ctx.set('location', `/api/v1/restaurants/${newRestaurant.id}`)
  }

  public async upload(ctx: Context) {
    const authUser: AuthUser = ctx.state.user
    const restaurants: Restaurant[] = ctx.request.body.restaurants

    console.log(authUser.id)
    ctx.body = new Array()
    for await (const restaurant of restaurants) {
      try {
        await this.manager.create(restaurant)
        ctx.body.push(restaurant)
      } catch (error) {
        // change to update
        ctx.body.push(error)
      }
    }
    ctx.status = 201
    ctx.set('location', `/api/v1/restaurants/`)
  }

  public async update(ctx: Context) {
    const restaurantDto = ctx.request.body
    // const authUser: AuthUser = ctx.state.user
    const restaurant = await this.manager.find(ctx.params.id)

    restaurant.blurhash = restaurantDto.blurhash
    restaurant.location = restaurantDto.location
    restaurant.name = restaurantDto.name
    restaurant.online = restaurantDto.online
    restaurant.launch_date = restaurantDto.launchDate
    restaurant.popularity = restaurantDto.popularity
    restaurant.created = restaurantDto.created
    restaurant.updated = restaurantDto.updated

    const updatedRestaurant = await this.manager.update(restaurant)

    ctx.body = new RestaurantModel(updatedRestaurant)
    ctx.status = 200
  }

  public async delete(ctx: Context) {
    // const authUser: AuthUser = ctx.state.user
    const id: number = ctx.params.id

    await this.manager.delete(id)

    ctx.status = 204
  }
}
