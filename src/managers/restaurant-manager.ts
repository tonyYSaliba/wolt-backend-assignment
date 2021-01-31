import { Restaurant } from '../entities'
import CONSTANTS from '../lib/constants'
import { RestaurantRepository } from '../repositories'

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

  public async discoverRestaurants(
    longitude: number,
    latitude: number
  ): Promise<Array<{ title: string; restaurants: Restaurant[] }>> {
    const popularRestaurants = await this.discoverPopularRestaurants(
      longitude,
      latitude
    )
    const newestRestaurants = await this.discoverNewestRestaurants(
      longitude,
      latitude
    )
    const nearestRestaurants = await this.discoverNearestRestaurants(
      longitude,
      latitude
    )
    const discovery = []
    if (popularRestaurants.length) {
      discovery.push({
        title: 'Popular Restaurants',
        restaurants: popularRestaurants
      })
    }
    if (newestRestaurants.length) {
      discovery.push({
        title: 'New Restaurants',
        restaurants: newestRestaurants
      })
    }
    if (nearestRestaurants.length) {
      discovery.push({
        title: 'Nearby Restaurants',
        restaurants: nearestRestaurants
      })
    }
    return discovery
  }

  public async discoverPopularRestaurants(
    longitude: number,
    latitude: number
  ): Promise<Restaurant[]> {
    return this.repo.findByLowerRadiusOrderByPopularityAndOnline(
      longitude,
      latitude,
      CONSTANTS.discoveryRadius,
      CONSTANTS.discoveryLimit
    )
  }

  public async discoverNewestRestaurants(
    longitude: number,
    latitude: number
  ): Promise<Restaurant[]> {
    const date = new Date()
    date.setMonth(date.getMonth() - CONSTANTS.discoveryNewDuration)
    return this.repo.findByLowerRadiusAndGreaterDateOrderByDateAndOnline(
      longitude,
      latitude,
      CONSTANTS.discoveryRadius,
      date,
      CONSTANTS.discoveryLimit
    )
  }

  public async discoverNearestRestaurants(
    longitude: number,
    latitude: number
  ): Promise<Restaurant[]> {
    return this.repo.findByLowerRadiusOrderByDistanceAndOnline(
      longitude,
      latitude,
      CONSTANTS.discoveryRadius,
      CONSTANTS.discoveryLimit
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
