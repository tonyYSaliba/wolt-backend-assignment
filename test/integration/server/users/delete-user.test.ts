import { expect } from 'chai'
import * as supertest from 'supertest'
import { database, setAdminMode, truncateTables } from '../../database-utils'
import { createUserTest, getLoginToken, testServer } from '../../server-utils'

describe('DELETE /api/v1/users/:id', () => {
  beforeEach(async () => {
    await truncateTables(['restaurant', 'user'])
  })

  it('Should delete a user', async () => {
    await createUserTest({
      email: 'god@gmail.com',
      firstName: 'Jesus',
      lastName: 'Christ',
      password: 'godmode'
    })

    await setAdminMode('god@gmail.com')
    const adminToken = await getLoginToken('god@gmail.com', 'godmode')

    const user = await createUserTest({
      email: 'user@gmail.com',
      firstName: 'super',
      lastName: 'test',
      password: 'test'
    })

    await supertest(testServer)
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', adminToken)
      .expect(204)

    const conn = await database.getConnection()

    const users = await conn.from('user').select()

    expect(users.length).eql(1)
    expect(users[0].email).eql('god@gmail.com')

    const restaurants = await conn.from('restaurant').count()

    expect(parseInt(restaurants[0].count, 10)).eql(0)
  })

  it('Should return not allowed error', async () => {
    await createUserTest({
      email: 'god@gmail.com',
      firstName: 'God',
      lastName: 'Mode',
      password: 'godmode'
    })

    const user = await createUserTest({
      email: 'dude@gmail.com',
      firstName: 'super',
      lastName: 'test',
      password: 'test'
    })

    const token = await getLoginToken('god@gmail.com', 'godmode')

    await supertest(testServer)
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', token)
      .expect(403)
  })

  it('Should return unauthorized when token is not valid', async () => {
    const res = await supertest(testServer)
      .delete('/api/v1/users/${user.id}')
      .set('Authorization', 'wrong token')
      .expect(401)

    expect(res.body.code).equals(30002)
  })

  it('Should return unauthorized when token is missing', async () => {
    const res = await supertest(testServer)
      .delete('/api/v1/users/1')
      .expect(401)

    expect(res.body.code).equals(30002)
  })
})
