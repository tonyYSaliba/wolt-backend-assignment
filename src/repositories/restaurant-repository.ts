import { Restaurant } from '../entities'
import { NotFoundError, ValidationError } from '../errors'
import { Postgres } from '../lib/database'

export class RestaurantRepository {
  private readonly TABLE: string = 'restaurant'
  private db: Postgres

  constructor(db: Postgres) {
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

    try {
      const result = await conn.table(this.TABLE).insert({
        blurhash: restaurant.blurhash,
        longitude: restaurant.location[0],
        latitude: restaurant.location[1],
        name: restaurant.name,
        online: restaurant.online,
        launch_date: restaurant.launch_date,
        popularity: restaurant.popularity,
        created: restaurant.created,
        updated: restaurant.updated
      })

      restaurant.id = result[0]

      return restaurant
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ValidationError(
          `Restaurant ${restaurant.name} already exists`,
          err
        )
      }

      throw err
    }
  }

  public async update(restaurant: Restaurant): Promise<Restaurant> {
    restaurant.updated = new Date()

    const conn = await this.db.getConnection()

    await conn
      .table(this.TABLE)
      .update({
        blurhash: restaurant.blurhash,
        longitude: restaurant.location[0],
        latitude: restaurant.location[1],
        name: restaurant.name,
        online: restaurant.online,
        launch_date: restaurant.launch_date,
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
      location: [row.longitude, row.latitude],
      name: row.name,
      online: row.online === 1,
      launch_date: row.launch_date,
      popularity: row.popularity,
      created: row.created,
      updated: row.updated
    }
  }
}
