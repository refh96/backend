// EstadoSeeder.js
'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class EstadoSeeder {
  static async run () {
    await Database.table('estados').insert([
      {
        'nombre' : 'Pendiente',
        'mensaje': 'Su reserva está proceso para su revisión por parte de la empresa, se le notificará cuando su estado cambie',
      },
      {
        'nombre' : 'Aprobado',
        'mensaje': 'Su reserva ha sido aprobada para ser realizada en la fecha y hora seleccionadas. Lo esperamos para realizar su servicio en nuestro Local',
      },
      {
        'nombre' : 'Rechazado',
        'mensaje': 'Debido a la saturación de pedidos, ese horario y fecha no se encuentra disponible. Por favor, edite su reserva si desea continuar',
      },
      {
        'nombre' : 'En proceso',
        'mensaje': 'Su servicio se encuentra en proceso en este momento. Se le notificará cuando esté completado',
      },
      {
        'nombre' : 'Completado',
        'mensaje': 'Su servicio ha sido completado satisfactoriamente. Puede acercarse al local para revisar su vehículo y pagar por su servicio',
      },
      {
        'nombre' : 'Finalizado',
        'mensaje': 'Su servicio fue realizado y pagado satisfactoriamente. Gracias Por Preferirnos',
      },
    ])
  }
}

module.exports = EstadoSeeder
