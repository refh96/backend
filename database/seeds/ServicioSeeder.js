'use strict'

const Servicio = use('App/Models/Servicio')
const Atributo = use('App/Models/Atributo')

class ServicioSeeder {
  static async run () {
    // Crear un servicio
    const servicioBasico = await Servicio.create({
      nombre_servicio: 'Lavado Basico',
      descripcion: 'tiempo estimado de servicio 1 hora',
      categoria: 'Lavados',
      precio: 0 // Inicialmente en 0
    })

    // Obtener los atributos seleccionados
    const atributos = await Atributo.query().whereIn('id', [1, 2, 3, 5]).fetch()

    // Asignar los atributos al servicio
    await servicioBasico.atributos().attach(atributos.rows.map(attr => attr.id))

    // Calcular el precio total sumando los costos de los atributos seleccionados
    const totalCostoAtributos = atributos.rows.reduce((total, atributo) => total + atributo.costo_atributo, 0)

    // Actualizar el precio del servicio con el total calculado
    servicioBasico.precio = totalCostoAtributos
    await servicioBasico.save()

    // Puedes repetir el mismo proceso para otros servicios, como el siguiente:
    const servicioPremium = await Servicio.create({
      nombre_servicio: 'Lavado Premium',
      descripcion: 'tiempo estimado de servicio 2 horas',
      categoria: 'Lavados',
      precio: 0 // Inicialmente en 0
    })

    // Obtener atributos para este servicio
    const atributosPremium = await Atributo.query().whereIn('id', [1, 2, 3, 4, 5, 6, 7]).fetch()
    await servicioPremium.atributos().attach(atributosPremium.rows.map(attr => attr.id))

    // Calcular el precio
    const totalCostoPremium = atributosPremium.rows.reduce((total, atributo) => total + atributo.costo_atributo, 0)
    servicioPremium.precio = totalCostoPremium
    await servicioPremium.save()
  }
}

module.exports = ServicioSeeder
