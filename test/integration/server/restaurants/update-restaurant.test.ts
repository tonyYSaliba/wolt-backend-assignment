import { expect } from 'chai'
import * as supertest from 'supertest'
import { truncateTables } from '../../database-utils'
import {
  createRestaurantTest,
  createUserTest,
  getLoginToken,
  testServer
} from '../../server-utils'

describe('PUT /api/v1/restaurants/:id', () => {
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

  beforeEach(async () => {
    await truncateTables(['restaurant'])
  })

  it('Should update a restaurant', async () => {
    let location: [number, number]
    location = [24.933257, 60.171263]
    const restaurant = await createRestaurantTest(
      {
        blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
        location,
        name: 'Charming Cherry House',
        online: true,
        launch_date: new Date('2020-09-20'),
        popularity: 0.665082352909038
      },
      token
    )

    const res = await supertest(testServer)
      .put(`/api/v1/restaurants/${restaurant.id}`)
      .set('Authorization', token)
      .send({
        blurhash: 'UJAw_5[.OEW;2vJ-#,a}ODJ-OEwc,VwcSgSg',
        location,
        name: 'Charming Cherry House',
        online: false,
        launch_date: new Date('2020-01-25'),
        popularity: 0.9385898095797295
      })
      .expect(200)

    location = [24.927635, 60.160208]
    expect(res.body).include({
      blurhash: 'UJAw_5[.OEW;2vJ-#,a}ODJ-OEwc,VwcSgSg',
      location,
      name: 'Charming Cherry House',
      online: false,
      launch_date: new Date('2020-01-25'),
      popularity: 0.9385898095797295
    })
  })

  it('Should return 400 when missing body data', async () => {
    let location: [number, number]
    location = [24.933257, 60.171263]
    const restaurant = await createRestaurantTest(
      {
        blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
        location,
        name: 'Potato Garden',
        online: true,
        launch_date: new Date('2022-09-20'),
        popularity: 0.665082352909032
      },
      token
    )

    const res = await supertest(testServer)
      .put(`/api/v1/restaurants/${restaurant.id}`)
      .set('Authorization', token)
      .send({
        blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
        location,
        name: 'Potato Garden',
        online: true,
        launch_date: new Date('2022-09-20')
      })
      .expect(400)

    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(1)
    expect(res.body.fields[0].message).eql('"done" is required')
  })

  it('Should return unauthorized when token is not valid', async () => {
    const res = await supertest(testServer)
      .put('/api/v1/restaurants/1')
      .set('Authorization', 'wrong token')
      .expect(401)

    expect(res.body.code).equals(30002)
  })

  it('Should return unauthorized when token is missing', async () => {
    const res = await supertest(testServer)
      .put('/api/v1/restaurants/1')
      .expect(401)

    expect(res.body.code).equals(30002)
  })
})
