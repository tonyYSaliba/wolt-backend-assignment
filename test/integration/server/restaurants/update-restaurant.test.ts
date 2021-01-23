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
    const restaurant = await createRestaurantTest(
      { name: 'Do homework', description: 'Exercise 1 and 2' },
      token
    )

    const res = await supertest(testServer)
      .put(`/api/v1/restaurants/${restaurant.id}`)
      .set('Authorization', token)
      .send({ name: 'Do TPC', description: 'Some job', done: true })
      .expect(200)

    expect(res.body).include({
      name: 'Do TPC',
      description: 'Some job',
      done: true
    })
  })

  it('Should return 400 when missing body data', async () => {
    const restaurant = await createRestaurantTest(
      { name: 'Do homework', description: 'Exercise 1 and 2' },
      token
    )

    const res = await supertest(testServer)
      .put(`/api/v1/restaurants/${restaurant.id}`)
      .set('Authorization', token)
      .send({ name: 'Do TPC', description: 'Some job' })
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
