'use strict'

const Database = use('Database')

class ServicioSeeder {
  static async run () {
    await Database.table('servicios').insert([
      {
        nombre_servicio: 'Lavado Basico',
        tiempo_estimado: 60, // 1 hora
        detalles_incluidos: 'Lavado Externo, Aspirado Interno, Limpieza e Hidratación de plásticos Internos, Limpieza y renovador básico de llantas',
        categoria: 'Lavados',
        precio: 15000,
      },
      {
        nombre_servicio: 'Lavado Premium',
        tiempo_estimado: 120, // 2 horas
        detalles_incluidos: 'Lavado Completo, Aplicacion Cera Hidrofobica, Aspirado Profundo, Limpieza e Hidratación de plásticos Internos y Externos, Limpieza y renovador Premium de llantas, Limpieza De Vidrios',
        categoria: 'Lavados',
        precio: 20000,
      },
      {
        nombre_servicio: 'Lavado Detailing',
        tiempo_estimado: 1440, // 1 día (24 horas)
        detalles_incluidos: 'Aplicacion Cera Hidrofobica, Limpieza profunda de tapices, Secado de asientos, Limpieza de techo, Limpieza y secado de alfombra, Limpieza e Hidratación de plásticos Internos y Externos, Limpieza y renovador Premium de llantas, Limpieza De Vidrios',
        categoria: 'Lavados',
        precio: 100000,
      },
      {
        nombre_servicio: 'Lavado de Tapices',
        tiempo_estimado: 1440, // 1 día (24 horas)
        detalles_incluidos: 'Secado de asientos, Limpieza profunda de tapices, Eliminación de manchas, Hidratación de tapices de cuero (si aplica)',
        categoria: 'Lavados',
        precio: 50000,
      },
      {
        nombre_servicio: 'Cambio de Aceite',
        tiempo_estimado: 60, // 1 hora
        detalles_incluidos: 'Cambio de aceite de motor, Revisión de niveles de fluidos, Cambio de filtro de aceite',
        categoria: 'Otros',
        precio: 25000,
      },
      {
        nombre_servicio: 'Pulido de Focos',
        tiempo_estimado: 120, // 2 horas
        detalles_incluidos: 'Pulido de ambos focos delanteros, Aplicación de sellador UV, Eliminación de amarillamiento y opacidad',
        categoria: 'Otros',
        precio: 35000,
      },
    ])
  }
}

module.exports = ServicioSeeder
