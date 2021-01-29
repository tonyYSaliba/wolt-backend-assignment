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

  public findAll(limit: number, offset: number): Promise<Restaurant[]> {
    return this.repo.findAll(limit, offset)
  }

  public async findByLowerRadiusOrderByPopularityAndOnline(
    longitude: number,
    latitude: number,
    radius: number,
    limit: number
  ): Promise<Restaurant[]> {
    return this.repo.findByLowerRadiusOrderByPopularityAndOnline(
      longitude,
      latitude,
      radius,
      limit
    )
  }

  public async findByLowerRadiusAndGreaterDateOrderByDateAndOnline(
    longitude: number,
    latitude: number,
    radius: number,
    date: Date,
    limit: number
  ): Promise<Restaurant[]> {
    return this.repo.findByLowerRadiusAndGreaterDateOrderByDateAndOnline(
      longitude,
      latitude,
      radius,
      date,
      limit
    )
  }

  public async findByLowerRadiusOrderByDistanceAndOnline(
    longitude: number,
    latitude: number,
    radius: number,
    limit: number
  ): Promise<Restaurant[]> {
    return this.repo.findByLowerRadiusOrderByDistanceAndOnline(
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
