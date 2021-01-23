import * as pino from 'pino'
import * as supertest from 'supertest'
import { createContainer } from '../../src/container'
import { createServer } from '../../src/server'
import { CreateRestaurant, RestaurantModel } from '../../src/server/restaurants/model'
import { CreateUser, UserModel } from '../../src/server/users/model'
import { database } from './database-utils'

const logger = pino({ name: 'test', level: 'silent' })
const container = createContainer(database, logger)
const port = Number(process.env.PORT) || 8080

export const appServer = createServer(container)
export const testServer = appServer.listen(port)

export async function createUserTest(user: CreateUser): Promise<UserModel> {
  const res = await supertest(testServer)
    .post('/api/v1/users')
    .send(user)
    .expect(201)

  return res.body
}

export function shuttingDown(): void {
  container.health.shuttingDown()
}

export async function createRestaurantTest(
  restaurant: CreateRestaurant,
  token: string
): Promise<RestaurantModel> {
  const res = await supertest(testServer)
    .post('/api/v1/restaurants')
    .set('Authorization', token)
    .send(restaurant)
    .expect(201)

  return res.body
}

export async function getLoginToken(
  email: string,
  password: string
): Promise<string> {
  const res = await supertest(testServer)
    .post('/api/v1/users/login')
    .send({ email, password })
    .expect(200)

  return res.body.accessToken
}
