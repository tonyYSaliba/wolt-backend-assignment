import { expect } from 'chai'
import * as supertest from 'supertest'
import { truncateTables } from '../../database-utils'
import {
  createRestaurantTest,
  createUserTest,
  getLoginToken,
  testServer
} from '../../server-utils'

describe('GET /api/v1/restaurants/:id', () => {
  let token: string

  before(async () => {
    await truncateTables(['restaurant', 'user'])

    const user = {
      email: 'dude@gmail.com',
      firstName: 'super',
      lastName: 'mocha',
      password: 'secret'
    }

    await createUserTest(user)
    token = await getLoginToken('dude@gmail.com', 'secret')
  })

  it('Should return a single restaurant', async () => {
    let location: [number, number]
    location = [24.933257, 60.171263]
    const restaurant = {
      blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
      location,
      name: 'Charming Cherry House',
      online: true,
      launch_date: new Date('2020-09-20'),
      popularity: 0.665082352909038
    }

    const createdRestaurant = await createRestaurantTest(restaurant, token)

    const res = await supertest(testServer)
      .get(`/api/v1/restaurants/${createdRestaurant.id}`)
      .set('Authorization', token)
      .expect(200)

    expect(res.body).includes({
      blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
      location,
      name: 'Charming Cherry House',
      online: true,
      launch_date: new Date('2020-09-20'),
      popularity: 0.665082352909038
    })
  })

  it('Should return 404 when restaurant does not exist', async () => {
    await supertest(testServer)
      .get(`/api/v1/restaurants/111111111`)
      .set('Authorization', token)
      .expect(404)
  })

  it('Should return unauthorized when token is not valid', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/1')
      .set('Authorization', 'wrong token')
      .expect(401)

    expect(res.body.code).equals(30002)
  })

  it('Should return unauthorized when token is missing', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/1')
      .expect(401)

    expect(res.body.code).equals(30002)
  })
})
