'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtributoSchema extends Schema {
  up () {
    this.create('atributos', (table) => {
      table.increments()
      table.string('nombre_atributo').notNullable()
      table.integer('costo_atributo').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('atributos')
  }
}

module.exports = AtributoSchema
