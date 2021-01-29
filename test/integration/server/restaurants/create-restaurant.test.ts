import { expect } from 'chai'
import * as supertest from 'supertest'
import { truncateTables } from '../../database-utils'
import { createUserTest, getLoginToken, testServer } from '../../server-utils'

describe('POST /api/v1/restaurants', () => {
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

  it('Should create a restaurant and return 201', async () => {
    const restaurant = {
      blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
      location: [24.933257, 60.171263],
      name: 'Charming Cherry House',
      online: true,
      launch_date: '2020-09-20',
      popularity: 0.665082352909038
    }

    const res = await supertest(testServer)
      .post('/api/v1/restaurants')
      .set('Authorization', token)
      .send(restaurant)
      .expect(201)

    expect(res.header.location).equals(`/api/v1/restaurants/${res.body.id}`)
    expect(res.body).includes({
      id: res.body.id,
      blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
      name: 'Charming Cherry House',
      online: true,
      launch_date: '2020-09-20',
      popularity: 0.665082352909038
    })
    expect(res.body.location[0]).equals(24.933257)
    expect(res.body.location[1]).equals(60.171263)
    expect(res.body.location.length).equals(2)
  })

  it('Should return 400 when missing body data', async () => {
    const restaurant = {
      blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
      location: [24.933257, 60.171263],
      online: true,
      launch_date: '2020-09-20',
      popularity: 0.665082352909038
    }

    const res = await supertest(testServer)
      .post('/api/v1/restaurants')
      .set('Authorization', token)
      .send(restaurant)
      .expect(400)

    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(1)
    expect(res.body.fields[0].message).eql('"name" is required')
  })

  it('Should return unauthorized when token is not valid', async () => {
    const res = await supertest(testServer)
      .post('/api/v1/restaurants')
      .set('Authorization', 'wrong token')
      .expect(401)

    expect(res.body.code).equals(30002)
  })

  it('Should return unauthorized when token is missing', async () => {
    const res = await supertest(testServer)
      .post('/api/v1/restaurants')
      .expect(401)

    expect(res.body.code).equals(30002)
  })
})
