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
      table.integer('estado_id').unsigned().references('id').inTable('estados').onDelete('cascade')
      table.integer('tipo_vehiculo_id').unsigned().references('id').inTable('tipo_vehiculos').onDelete('cascade')
      table.string('url_antes')
      table.string('url_despues')
      table.integer('Total')
      table.timestamps()
    })
  }

  down () {
    this.drop('reservas')
  }
}

module.exports = ReservaSchema
