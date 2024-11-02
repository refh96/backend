'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Atributo extends Model {
  static get table() {
    return 'atributos';
  }
  servicios() {
    return this.belongsToMany('App/Models/Servicio').pivotTable('atributo_servicio')
  }
  reservas() {
    return this.belongsToMany('App/Models/Reserva').pivotTable('atributo_reserva') // Asegúrate de que el nombre de la tabla pivote sea correcto
  }
  static get hidden() {
    return ['created_at', 'updated_at']
  }
}

module.exports = Atributo
