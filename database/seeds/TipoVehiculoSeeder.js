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
        'nombre' : 'Sedan, Hatchback, Coupe, Cabina simple',
        'costo': 0,
      },
      {
        'nombre' : 'SUV (5 Asientos), Camionetas',
        'costo': 10000,
      },
      {
        'nombre' : 'SUV (7 Asientos), Camionetas XL, Furgones',
        'costo': 20000,
      },
    ])
  }
}

module.exports = TipoVehiculoSeeder
