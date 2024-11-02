'use strict'


/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const ServicioSeeder = use('./ServicioSeeder')
const TipoVehiculoSeeder = use('./TipoVehiculoSeeder')
const EstadoSeeder = use('./EstadoSeeder')
const AtributoSeeder = use('./AtributoSeeder')

class DataBaseSeeder {
  async run () {
    await AtributoSeeder.run();
    await ServicioSeeder.run();
    await TipoVehiculoSeeder.run();
    await EstadoSeeder.run();

  }
}

module.exports = DataBaseSeeder
