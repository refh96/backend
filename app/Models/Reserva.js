'use strict'

const Model = use('Model')

class Reserva extends Model {
  static get table () {
    return 'reservas'
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
  atributos() {
    return this.belongsToMany('App/Models/Atributo').pivotTable('atributo_reserva');
  }
  servicio () {
    return this.belongsTo('App/Models/Servicio')
  }

  tipo_vehiculo () {
    return this.belongsTo('App/Models/TipoVehiculo') // Nueva relación
  }
  estado () {
    return this.belongsTo('App/Models/Estado') // Nueva relación
  }

  
}

module.exports = Reserva
