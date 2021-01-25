import * as knex from 'knex'

export function up(db: knex) {
  return db.schema
    .createTable('user', table => {
      table.increments('id').primary()
      table.string('email', 64).unique()
      table.string('password', 256).notNullable()
      table.enum('role', ['user', 'admin']).defaultTo('user')
      table.string('first_name', 64).notNullable()
      table.string('last_name', 64).notNullable()
      table.dateTime('created').notNullable()
      table.dateTime('updated').notNullable()
    })
    .then(() => {
      return db.schema.createTable('restaurant', table => {
        table.increments('id').primary()
        table.string('blurhash').notNullable()
        table.float('longitude').notNullable()
        table.float('latitude').notNullable()
        table.string('name', 64).notNullable()
        table.boolean('online').notNullable()
        table.dateTime('launch_date').notNullable()
        table.float('popularity').notNullable()
        table.dateTime('created').notNullable()
        table.dateTime('updated').notNullable()
      })
    })
}

export function down(db: knex) {
  return db.schema.dropTable('restaurant').dropTable('user')
}
