'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TipoVehiculo extends Model {
  static get table() {
    return 'tipo_vehiculos';
  }
  reservas() {
    return this.hasMany('App/Models/Reserva', 'id', 'tipo_vehiculo_id');
  }
  static get hidden() {
    return ['created_at', 'updated_at']
  }
}

module.exports = TipoVehiculo
