'use strict'

const Schema = use('Schema')

class AtributoReservaSchema extends Schema {
  up () {
    this.create('atributo_reserva', (table) => {
      table.increments()
      table.integer('reserva_id').unsigned().references('id').inTable('reservas').onDelete('CASCADE')
      table.integer('atributo_id').unsigned().references('id').inTable('atributos').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('atributo_reserva')
  }
}

module.exports = AtributoReservaSchema
