'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class AtributoSeeder {
  static async run () {
    await Database.table('atributos').insert([

      {
        'nombre_atributo':'Aromatizante Paradise Air',
        'costo_atributo':5000,
      },
      {
        'nombre_atributo':'Aplicacion de cera hidrofobica',
        'costo_atributo':5000,
      },
    ])
  }
}

module.exports = AtributoSeeder
