import { Restaurant } from '../entities'
import { RestaurantRepository } from '../repositories'

const discoveryRadius = 1500
const discoveryLimit = 10
const discoveryNewDuration = 4 // in months
export class RestaurantManager {
  private repo: RestaurantRepository

  constructor(repo: RestaurantRepository) {
    this.repo = repo
  }

  public find(id: number): Promise<Restaurant> {
    return this.repo.find(id)
  }

  public async findAll(limit: number, offset: number): Promise<Restaurant[]> {
    return this.repo.findAll(limit, offset)
  }

  public async discoverPopularRestaurants(
    longitude: number,
    latitude: number
  ): Promise<Restaurant[]> {
    return this.repo.findByLowerRadiusOrderByPopularityAndOnline(
      longitude,
      latitude,
      discoveryRadius,
      discoveryLimit
    )
  }

  public async discoverNewestRestaurants(
    longitude: number,
    latitude: number
  ): Promise<Restaurant[]> {
    const date = new Date()
    date.setMonth(date.getMonth() - discoveryNewDuration)
    return this.repo.findByLowerRadiusAndGreaterDateOrderByDateAndOnline(
      longitude,
      latitude,
      discoveryRadius,
      date,
      discoveryLimit
    )
  }

  public async discoverNearestRestaurants(
    longitude: number,
    latitude: number
  ): Promise<Restaurant[]> {
    return this.repo.findByLowerRadiusOrderByDistanceAndOnline(
      longitude,
      latitude,
      discoveryRadius,
      discoveryLimit
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
