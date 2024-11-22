'use strict'

const Servicio = use('App/Models/Servicio')
const Database = use('Database')

class ServicioSeeder {
  static async run () {
    await Database.table('servicios').insert([
      {
        'nombre_servicio' : 'Lavado Basico',
        'descripcion': 'tiempo estimado de servicio 1 hora',
        'categoria': 'Lavados',
        'precio': 15000,
      },
      {
        'nombre_servicio' : 'Lavado Premium',
        'descripcion': 'tiempo estimado de servicio 2 horas',
        'categoria': 'Lavados',
        'precio': 20000,
      },
      {
        'nombre_servicio' : 'Lavado Detailing',
        'descripcion': 'tiempo estimado de servicio 1 Dia(secado de asientos, techo y alfombra)',
        'categoria': 'Lavados',
        'precio': 100000,
      },
      {
        'nombre_servicio' : 'Lavado de Tapices',
        'descripcion': 'tiempo estimado de servicio 1 Dia(secado de asientos)',
        'categoria': 'Lavados',
        'precio': 50000,
      },
      {
        'nombre_servicio' : 'Cambio de Aceite',
        'descripcion': 'tiempo estimado de servicio 1 hora',
        'categoria': 'Otros',
        'precio': 25000,
        },
      {
        'nombre_servicio' : 'Pulido de Focos',
        'descripcion': 'tiempo estimado de servicio 2 horas',
        'categoria': 'Otros',
        'precio': 35000,
      },
    ])
  }
}

module.exports = ServicioSeeder
