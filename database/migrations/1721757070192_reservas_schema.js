'use strict'

const Schema = use('Schema')

class ReservaSchema extends Schema {
  up () {
    this.create('reservas', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('servicio_id').unsigned().references('id').inTable('servicios').onDelete('CASCADE')
      table.date('fecha').notNullable()
      table.time('hora').notNullable()
      table.string('estado').notNullable()
      table.string('tipo_vehiculo').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('reservas')
  }
}

module.exports = ReservaSchema
