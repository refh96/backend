'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServicioSchema extends Schema {
  up () {
    this.create('servicios', (table) => {
      table.increments()
      table.string('nombre_servicio').notNullable()
      table.integer('tiempo_estimado').notNullable() // En minutos para cálculos más fáciles
      table.string('detalles_incluidos').notNullable()
      table.string('categoria').notNullable()
      table.integer('precio').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('servicios')
  }
}

module.exports = ServicioSchema
