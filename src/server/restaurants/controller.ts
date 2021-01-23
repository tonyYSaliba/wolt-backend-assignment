import { Context } from 'koa'
import { Restaurant } from '../../entities'
import { AuthUser } from '../../lib/authentication'
import { RestaurantManager } from '../../managers'
import { RestaurantModel } from './model'

export class RestaurantController {
  private manager: RestaurantManager

  constructor(manager: RestaurantManager) {
    this.manager = manager
  }

  public async get(ctx: Context) {
    const authUser: AuthUser = ctx.state.user
    const restaurant = await this.manager.find(authUser.id, ctx.params.id)

    ctx.body = new RestaurantModel(restaurant)
    ctx.status = 200
  }

  public async getAll(ctx: Context) {
    const authUser: AuthUser = ctx.state.user
    const limit = isNaN(ctx.query.limit) ? 10 : parseInt(ctx.query.limit, 10)
    const offset = isNaN(ctx.query.offset) ? 0 : parseInt(ctx.query.offset, 10)
    const restaurants = await this.manager.findUserRestaurants(authUser.id, limit, offset)

    ctx.body = restaurants.map((t: Restaurant) => new RestaurantModel(t))
    ctx.status = 200
  }

  public async create(ctx: Context) {
    const authUser: AuthUser = ctx.state.user
    const restaurant: Restaurant = ctx.request.body

    restaurant.userId = authUser.id
    restaurant.done = false

    const newRestaurant = await this.manager.create(restaurant)

    ctx.body = new RestaurantModel(newRestaurant)
    ctx.status = 201
    ctx.set('location', `/api/v1/restaurants/${newRestaurant.id}`)
  }

  public async update(ctx: Context) {
    const restaurantDto = ctx.request.body
    const authUser: AuthUser = ctx.state.user
    const restaurant = await this.manager.find(authUser.id, ctx.params.id)

    restaurant.name = restaurantDto.name
    restaurant.description = restaurantDto.description
    restaurant.done = restaurantDto.done

    const updatedRestaurant = await this.manager.update(restaurant)

    ctx.body = new RestaurantModel(updatedRestaurant)
    ctx.status = 200
  }

  public async delete(ctx: Context) {
    const authUser: AuthUser = ctx.state.user
    const id: number = ctx.params.id

    await this.manager.delete(authUser.id, id)

    ctx.status = 204
  }
}
