'use strict'

/*
|--------------------------------------------------------------------------
| TipoVehiculoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class TipoVehiculoSeeder {
  static async run () {
    await Database.table('tipo_vehiculos').insert([
      {
        'nombre' : 'sedan',
        'costo': 0,
      },
      {
        'nombre' : 'city car',
        'costo': 0,
      },
      {
        'nombre' : 'coupe',
        'costo': 0,
      },
      {
        'nombre' : 'hatchback',
        'costo': 0,
      },
      {
        'nombre' : 'suv(2 corridas de asiento)',
        'costo': 5000,
      },
      {
        'nombre' : 'station wagon(2 corridas de asiento)',
        'costo': 5000,
      },
      {
        'nombre' : 'todo terreno(2 corridas de asiento)',
        'costo': 5000,
      },
      {
        'nombre' : 'suv( 3 corridas de asiento)',
        'costo': 10000,
      },
      {
        'nombre' : 'Jeep( 3 corridas de asiento)',
        'costo': 10000,
      },
      {
        'nombre' : 'Camionetas( F-150 o similares)',
        'costo': 10000,
      },
    ])
  }
}

module.exports = TipoVehiculoSeeder
