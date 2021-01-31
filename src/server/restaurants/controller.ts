import { Context } from 'koa'
import { Restaurant } from '../../entities'
import { RestaurantManager } from '../../managers'
import { RestaurantModel, SectionModel, SectionsModel } from './model'

export class RestaurantController {
  private manager: RestaurantManager

  constructor(manager: RestaurantManager) {
    this.manager = manager
  }

  public async get(ctx: Context) {
    const restaurant = await this.manager.find(ctx.params.id)

    ctx.body = new RestaurantModel(restaurant)
    ctx.status = 200
  }

  public async getAll(ctx: Context) {
    const limit = isNaN(ctx.query.limit) ? 10 : parseInt(ctx.query.limit, 10)
    const offset = isNaN(ctx.query.offset) ? 0 : parseInt(ctx.query.offset, 10)
    const restaurants = await this.manager.findAll(limit, offset)

    ctx.body = restaurants.map((r: Restaurant) => new RestaurantModel(r))
    ctx.status = 200
  }

  public async discovery(ctx: Context) {
    const longitude = isNaN(ctx.query.lon) ? 0 : parseFloat(ctx.query.lon)
    const latitude = isNaN(ctx.query.lat) ? 0 : parseFloat(ctx.query.lat)

    const discovery = await this.manager.discoverRestaurants(
      longitude,
      latitude
    )
    const sections = new SectionsModel()
    discovery.map((s: { title: string; restaurants: Restaurant[] }) => {
      sections.sections.push(new SectionModel(s.title, s.restaurants))
    })
    ctx.body = sections
    ctx.status = 200
  }

  public async create(ctx: Context) {
    const restaurant: Restaurant = ctx.request.body

    const newRestaurant = await this.manager.create(restaurant)

    ctx.body = new RestaurantModel(newRestaurant)
    ctx.status = 201
    ctx.set('location', `/api/v1/restaurants/${newRestaurant.id}`)
  }

  public async upload(ctx: Context) {
    const restaurants: Restaurant[] = ctx.request.body.restaurants

    ctx.body = new Array()
    for await (const restaurant of restaurants) {
      const newRestaurant = await this.manager.create(restaurant)
      ctx.body.push(new RestaurantModel(newRestaurant))
    }
    ctx.status = 201
    ctx.set('location', `/api/v1/restaurants/`)
  }

  public async update(ctx: Context) {
    const restaurantDto = ctx.request.body
    const restaurant = await this.manager.find(ctx.params.id)

    restaurant.blurhash = restaurantDto.blurhash
    restaurant.location = restaurantDto.location
    restaurant.name = restaurantDto.name
    restaurant.online = restaurantDto.online
    restaurant.launch_date = restaurantDto.launch_date
    restaurant.popularity = restaurantDto.popularity
    restaurant.created = restaurantDto.created
    restaurant.updated = restaurantDto.updated

    const updatedRestaurant = await this.manager.update(restaurant)

    ctx.body = new RestaurantModel(updatedRestaurant)
    ctx.status = 200
  }

  public async delete(ctx: Context) {
    const id: number = ctx.params.id

    await this.manager.delete(id)
    ctx.status = 204
  }
}
