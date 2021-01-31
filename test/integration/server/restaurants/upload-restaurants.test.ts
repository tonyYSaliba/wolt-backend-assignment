import { expect } from 'chai'
import * as supertest from 'supertest'
import { truncateTables } from '../../database-utils'
import { createUserTest, getLoginToken, testServer } from '../../server-utils'

describe('POST /api/v1/restaurants/upload', () => {
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

  it('Should create the restaurants and return 201', async () => {
    const restaurants = {
      restaurants: [
        {
          blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
          location: [24.933257, 60.171263],
          name: 'Charming Cherry House',
          online: true,
          launch_date: '2020-09-20',
          popularity: 0.665082352909038
        },
        {
          blurhash: 'UKFGw4^KM}$$x@X8N1kB10R+xEWWR8Rlt4o0',
          launch_date: '2020-02-23',
          location: [24.941244, 60.171987],
          name: 'Ketchup XL',
          online: false,
          popularity: 0.30706741877410304
        },
        {
          blurhash: 'UCO;.s:bO%r_yWXlORbbC?TFvobaVDi_t9nS',
          launch_date: '2020-02-19',
          location: [24.935637, 60.156621],
          name: 'Tender Lettuce',
          online: true,
          popularity: 0.3919633748546864
        }
      ]
    }

    const res = await supertest(testServer)
      .post('/api/v1/restaurants/upload')
      .set('Authorization', token)
      .send(restaurants)
      .expect(201)

    expect(res.header.location).equals(`/api/v1/restaurants/`)
    expect(res.body[0]).includes({
      blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
      name: 'Charming Cherry House',
      online: true,
      launch_date: '2020-09-20',
      popularity: 0.665082352909038
    })
    expect(res.body[0].location[0]).equals(24.933257)
    expect(res.body[0].location[1]).equals(60.171263)
    expect(res.body[0].location.length).equals(2)
    expect(res.body[1]).includes({
      blurhash: 'UKFGw4^KM}$$x@X8N1kB10R+xEWWR8Rlt4o0',
      launch_date: '2020-02-23',
      name: 'Ketchup XL',
      online: false,
      popularity: 0.30706741877410304
    })
    expect(res.body[1].location[0]).equals(24.941244)
    expect(res.body[1].location[1]).equals(60.171987)
    expect(res.body[1].location.length).equals(2)
    expect(res.body[2]).includes({
      blurhash: 'UCO;.s:bO%r_yWXlORbbC?TFvobaVDi_t9nS',
      launch_date: '2020-02-19',
      name: 'Tender Lettuce',
      online: true,
      popularity: 0.3919633748546864
    })
    expect(res.body[2].location[0]).equals(24.935637)
    expect(res.body[2].location[1]).equals(60.156621)
    expect(res.body[2].location.length).equals(2)
    expect(res.body.length).equals(3)
  })

  it('Should return 400 when missing body data', async () => {
    const restaurants = {
      restaurants: [
        {
          blurhash: 'UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG',
          location: [24.933257, 60.171263],
          name: 'Charming Cherry House',
          online: true,
          launch_date: '2020-09-20',
          popularity: 0.665082352909038
        },
        {
          blurhash: 'UKFGw4^KM}$$x@X8N1kB10R+xEWWR8Rlt4o0',
          launch_date: '2020-02-23',
          location: [24.941244, 60.171987],
          name: 'Ketchup XL',
          online: false,
          popularity: 0.30706741877410304
        },
        {
          blurhash: 'UCO;.s:bO%r_yWXlORbbC?TFvobaVDi_t9nS',
          launch_date: '2020-02-19',
          location: [24.935637, 60.156621],
          name: 'Tender Lettuce',
          online: true
        }
      ]
    }

    const res = await supertest(testServer)
      .post('/api/v1/restaurants')
      .set('Authorization', token)
      .send(restaurants)
      .expect(400)

    expect(res.body.code).equals(30001)
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
