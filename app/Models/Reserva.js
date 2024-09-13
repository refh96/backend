'use strict'

const Model = use('Model')

class Reserva extends Model {
  static get table () {
    return 'reservas'
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  servicio () {
    return this.belongsTo('App/Models/Servicio')
  }

  static get hidden () {
    return ['created_at', 'updated_at']
  }
}

module.exports = Reserva
