import { Restaurant } from '../entities'
import { TaskRepository } from '../repositories'

export class TaskManager {
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

  public create(task: Restaurant): Promise<Restaurant> {
    return this.repo.insert(task)
  }

  public update(task: Restaurant): Promise<Restaurant> {
    return this.repo.update(task)
  }

  public delete(userId: number, taskId: number): Promise<void> {
    return this.repo.delete(userId, taskId)
  }
}
