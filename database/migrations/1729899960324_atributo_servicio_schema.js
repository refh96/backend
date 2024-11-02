'use strict'

const Schema = use('Schema')

class AtributoServicioSchema extends Schema {
  up () {
    this.create('atributo_servicio', (table) => {
      table.increments()
      table.integer('servicio_id').unsigned().references('id').inTable('servicios').onDelete('CASCADE')
      table.integer('atributo_id').unsigned().references('id').inTable('atributos').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('atributo_servicio')
  }
}

module.exports = AtributoServicioSchema
