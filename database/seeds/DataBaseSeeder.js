'use strict'


/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const ServicioSeeder = use('./ServicioSeeder')

class DataBaseSeeder {
  async run () {
    await ServicioSeeder.run();
  }
}

module.exports = DataBaseSeeder
