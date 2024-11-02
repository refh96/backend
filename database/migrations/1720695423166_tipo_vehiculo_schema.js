'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TipoVehiculoSchema extends Schema {
  up () {
    this.create('tipo_vehiculos', (table) => {
      table.increments()
      table.string('nombre').notNullable()
      table.integer('costo').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tipo_vehiculos')
  }
}

module.exports = TipoVehiculoSchema
