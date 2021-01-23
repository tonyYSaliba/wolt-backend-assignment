import { Logger } from 'pino'
import { Authenticator, JWTAuthenticator } from './lib/authentication'
import { MySql } from './lib/database'
import { BCryptHasher, Hasher } from './lib/hasher'
import { HealthMonitor } from './lib/health'
import { RestaurantManager, UserManager } from './managers'
import { TaskRepository, UserRepository } from './repositories'

export interface ServiceContainer {
  health: HealthMonitor
  logger: Logger
  lib: {
    hasher: Hasher
    authenticator: Authenticator
  }
  repositories: {
    restaurant: TaskRepository
    user: UserRepository
  }
  managers: {
    restaurant: RestaurantManager
    user: UserManager
  }
}

export function createContainer(db: MySql, logger: Logger): ServiceContainer {
  const taskRepo = new TaskRepository(db)
  const userRepo = new UserRepository(db)
  const hasher = new BCryptHasher()
  const authenticator = new JWTAuthenticator(userRepo)
  const healthMonitor = new HealthMonitor()

  return {
    health: healthMonitor,
    logger,
    lib: {
      hasher,
      authenticator
    },
    repositories: {
      restaurant: taskRepo,
      user: userRepo
    },
    managers: {
      restaurant: new RestaurantManager(taskRepo),
      user: new UserManager(userRepo, hasher, authenticator)
    }
  }
}
