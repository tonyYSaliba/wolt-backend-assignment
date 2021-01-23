import { Restaurant } from '../entities'
import { NotFoundError } from '../errors'
import { MySql } from '../lib/database'

export class TaskRepository {
  private readonly TABLE: string = 'restaurant'
  private db: MySql

  constructor(db: MySql) {
    this.db = db
  }

  public async find(userId: number, id: number): Promise<Restaurant> {
    const conn = await this.db.getConnection()
    const row = await conn
      .select()
      .from(this.TABLE)
      .where({ id, user_id: userId })
      .first()

    if (!row) {
      throw new NotFoundError('Restaurant does not exist')
    }

    return this.transform(row)
  }

  public async findByUser(
    userId: number,
    limit: number,
    offset: number
  ): Promise<Restaurant[]> {
    const conn = await this.db.getConnection()
    const results = await conn
      .select()
      .from(this.TABLE)
      .where({ user_id: userId })
      .orderBy('updated', 'DESC')
      .offset(offset)
      .limit(limit)

    return results.map((r: any) => this.transform(r))
  }

  public async insert(restaurant: Restaurant): Promise<Restaurant> {
    restaurant.created = new Date()
    restaurant.updated = new Date()

    const conn = await this.db.getConnection()
    const result = await conn.table(this.TABLE).insert({
      name: restaurant.name,
      description: restaurant.description,
      done: restaurant.done,
      created: restaurant.created,
      updated: restaurant.updated,
      user_id: restaurant.userId
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
        name: restaurant.name,
        description: restaurant.description,
        done: restaurant.done
      })
      .where({ user_id: restaurant.userId, id: restaurant.id })

    return restaurant
  }

  public async delete(userId: number, taskId: number): Promise<void> {
    const conn = await this.db.getConnection()

    const result = await conn
      .from(this.TABLE)
      .delete()
      .where({ id: taskId, user_id: userId })

    if (result === 0) {
      throw new NotFoundError('Restaurant does not exist')
    }
  }

  private transform(row: any): Restaurant {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      userId: row.user_id,
      done: row.done === 1,
      created: row.created,
      updated: row.updated
    }
  }
}
