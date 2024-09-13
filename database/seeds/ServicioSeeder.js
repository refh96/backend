'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
class ServicioSeeder {
  static async run () {
    await Database.table('servicios').insert([
      {
        'nombre_servicio' : 'Lavado Basico',
        'descripcion': 'tiempo estimado de servicio 1 hora',
        'categoria':'Lavados',
        'precio':15000
      },
      {
        'nombre_servicio' : 'Lavado Premium',
        'descripcion': 'tiempo estimado de servicio 2 hora',
        'categoria':'Lavados',
        'precio':20000
      },
      {
        'nombre_servicio' : 'Lavado de tapices',
        'descripcion': 'tiempo estimado de servicio 1 Dia',
        'categoria':'Lavados',
        'precio':35000
      },
      {
        'nombre_servicio' : 'Cambio de aceite',
        'descripcion': 'tiempo estimado de servicio medio Dia cambio de filtro',
        'categoria':'otros',
        'precio':35000
      },
      {
        'nombre_servicio' : 'Pulido de focos',
        'descripcion': 'tiempo estimado de servicio Medio Dia',
        'categoria':'otros',
        'precio':40000
      },
      {
        'nombre_servicio' : 'Lavado de motor',
        'descripcion': 'tiempo estimado de servicio 2 horas',
        'categoria':'Lavados',
        'precio':15000
      },
      {
        'nombre_servicio' : 'Pulido de carrocería',
        'descripcion': 'tiempo estimado de servicio 2 Dias',
        'categoria':'otros',
        'precio':100000
      },
      {
        'nombre_servicio' : 'Lavado de alfombra',
        'descripcion': 'tiempo estimado de servicio 2 Dia',
        'categoria':'Lavados',
        'precio':60000
      },
    ])
  }
}

module.exports = ServicioSeeder
