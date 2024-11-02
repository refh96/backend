// EstadoSeeder.js
'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class AtributoSeeder {
  static async run () {
    await Database.table('atributos').insert([
      {
        'nombre_atributo' : 'Aspirado profundo',
        'costo_atributo': 5000,
      },
      {
        'nombre_atributo' : 'Lavado Exterior Snow Foam',
        'costo_atributo': 5000,
      },
      {
        'nombre_atributo' : 'Limpienza e Hidratacion de plasticos internos',
        'costo_atributo': 5000,
      },
      {
        'nombre_atributo' : 'Limpienza e Hidratacion de plasticos externos',
        'costo_atributo': 5000,
      },
      {
        'nombre_atributo' : 'Limpieza de llantas',
          'costo_atributo': 2500,
        },
      {
      'nombre_atributo' : 'Limpieza de vidrios',
        'costo_atributo': 2500,
      },
      {
      'nombre_atributo' : 'Aplicacion de Cera Hidrofobica',
        'costo_atributo': 2500,
      },
      {
        'nombre_atributo':'Aromatizante Paradise Air',
        'costo_atributo':5000,
      },
      {
        'nombre_atributo':'Lavado de asientos,techo y alfombra',
        'costo_atributo':50000,
      },
      {
        'nombre_atributo':'Pulido de focos',
        'costo_atributo':10000,
      },
      {
        'nombre_atributo':'Cambio de Aceite',
        'costo_atributo':25000,
      },
    ])
  }
}

module.exports = AtributoSeeder
