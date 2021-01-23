import { Restaurant } from '../entities'
import { TaskRepository } from '../repositories'

export class RestaurantManager {
  private repo: TaskRepository

  constructor(repo: TaskRepository) {
    this.repo = repo
  }

  public find(userId: number, id: number): Promise<Restaurant> {
    return this.repo.find(userId, id)
  }

  public async findUserTasks(
    userId: number,
    limit: number,
    offset: number
  ): Promise<Restaurant[]> {
    return this.repo.findByUser(userId, limit, offset)
  }

  public create(restaurant: Restaurant): Promise<Restaurant> {
    return this.repo.insert(restaurant)
  }

  public update(restaurant: Restaurant): Promise<Restaurant> {
    return this.repo.update(restaurant)
  }

  public delete(userId: number, taskId: number): Promise<void> {
    return this.repo.delete(userId, taskId)
  }
}
