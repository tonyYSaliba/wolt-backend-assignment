import { expect } from 'chai'
import * as supertest from 'supertest'
import { truncateTables } from '../../database-utils'
import {
  createTaskTest,
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
    const restaurant = {
      name: 'Clean Room',
      description: 'Mom said that I need to clean my room.'
    }

    const createdTask = await createTaskTest(restaurant, token)

    const res = await supertest(testServer)
      .get(`/api/v1/restaurants/${createdTask.id}`)
      .set('Authorization', token)
      .expect(200)

    expect(res.body).includes({
      name: 'Clean Room',
      description: 'Mom said that I need to clean my room.',
      done: false
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
