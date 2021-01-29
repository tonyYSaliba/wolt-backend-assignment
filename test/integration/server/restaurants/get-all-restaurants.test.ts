import { expect } from 'chai'
import * as supertest from 'supertest'
import { truncateTables } from '../../database-utils'
import {
  createRestaurantTest,
  createUserTest,
  getLoginToken,
  testServer
} from '../../server-utils'

describe('GET /api/v1/restaurants', () => {
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

  it('Should return a list of restaurants', async () => {
    let location: [number, number]
    location = [24.933257, 60.171263]
    const restaurant1 = {
      blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
      location,
      name: 'Charming Cherry House',
      online: true,
      launch_date: new Date('2020-09-20'),
      popularity: 0.665082352909038
    }

    location = [24.927635, 60.160208]
    const restaurant2 = {
      blurhash: 'UJAw_5[.OEW;2vJ-#,a}ODJ-OEwc,VwcSgSg',
      location,
      name: 'Potato Garden',
      online: false,
      launch_date: new Date('2020-01-25'),
      popularity: 0.9385898095797295
    }

    await createRestaurantTest(restaurant1, token)
    await createRestaurantTest(restaurant2, token)

    const res = await supertest(testServer)
      .get('/api/v1/restaurants')
      .set('Authorization', token)
      .expect(200)

    expect(res.body.length).equals(2)
    expect(res.body[0].name).equals('Charming Cherry House')
    expect(res.body[1].name).equals('Potato Garden')
  })

  it('Should return unauthorized when token is not valid', async () => {
    const res = await supertest(testServer)
      .get(`/api/v1/restaurants`)
      .set('Authorization', 'wrong token')
      .expect(401)

    expect(res.body.code).equals(30002)
  })

  it('Should return unauthorized when token is missing', async () => {
    const res = await supertest(testServer)
      .get(`/api/v1/restaurants`)
      .expect(401)

    expect(res.body.code).equals(30002)
  })
})
