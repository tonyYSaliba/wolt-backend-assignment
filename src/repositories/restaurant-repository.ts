import { Restaurant } from '../entities'
import { NotFoundError } from '../errors'
import { MySql } from '../lib/database'

export class RestaurantRepository {
  private readonly TABLE: string = 'restaurant'
  private db: MySql

  constructor(db: MySql) {
    this.db = db
  }

  public async find(id: number): Promise<Restaurant> {
    const conn = await this.db.getConnection()
    const row = await conn
      .select()
      .from(this.TABLE)
      .where({ id })
      .first()

    if (!row) {
      throw new NotFoundError('Restaurant does not exist')
    }

    return this.transform(row)
  }

  public async insert(restaurant: Restaurant): Promise<Restaurant> {
    restaurant.created = new Date()
    restaurant.updated = new Date()

    const conn = await this.db.getConnection()
    const result = await conn.table(this.TABLE).insert({
      blurhash: restaurant.blurhash,
      longitude: restaurant.longitude,
      latitude: restaurant.latitude,
      name: restaurant.name,
      online: restaurant.online,
      launchDate: restaurant.launchDate,
      popularity: restaurant.popularity,
      created: restaurant.created,
      updated: restaurant.updated
    })

    restaurant.id = result[0]

    return restaurant
  }

  public async update(restaurant: Restaurant): Promise<Restaurant> {
    restaurant.updated = new Date()

    const conn = await this.db.getConnection()

    await conn
      .table(this.TABLE)
      .update({
        blurhash: restaurant.blurhash,
        longitude: restaurant.longitude,
        latitude: restaurant.latitude,
        name: restaurant.name,
        online: restaurant.online,
        launchDate: restaurant.launchDate,
        popularity: restaurant.popularity
      })
      .where({ id: restaurant.id })

    return restaurant
  }

  public async delete(restaurantId: number): Promise<void> {
    const conn = await this.db.getConnection()

    const result = await conn
      .from(this.TABLE)
      .delete()
      .where({ id: restaurantId })

    if (result === 0) {
      throw new NotFoundError('Restaurant does not exist')
    }
  }

  private transform(row: any): Restaurant {
    return {
      id: row.id,
      blurhash: row.blurhash,
      longitude: row.longitude,
      latitude: row.latitude,
      name: row.name,
      online: row.online === 1,
      launchDate: row.launchDate,
      popularity: row.popularity,
      created: row.created,
      updated: row.updated
    }
  }
}
