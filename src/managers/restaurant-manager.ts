import { Restaurant } from '../entities'
import { RestaurantRepository } from '../repositories'

export class RestaurantManager {
  private repo: RestaurantRepository

  constructor(repo: RestaurantRepository) {
    this.repo = repo
  }

  public find(id: number): Promise<Restaurant> {
    return this.repo.find(id)
  }

  public async findByRadiusOrderByPopularityAndOnline(
    longitude: number,
    latitude: number,
    radius: number,
    limit: number
  ): Promise<Restaurant[]> {
    return this.repo.findByRadiusOrderByPopularityAndOnline(
      longitude,
      latitude,
      radius,
      limit
    )
  }

  public create(restaurant: Restaurant): Promise<Restaurant> {
    return this.repo.insert(restaurant)
  }

  public update(restaurant: Restaurant): Promise<Restaurant> {
    return this.repo.update(restaurant)
  }

  public delete(restaurantId: number): Promise<void> {
    return this.repo.delete(restaurantId)
  }
}
