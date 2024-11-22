'use strict'

const Servicio = use('App/Models/Servicio')
const { validateAll } = use('Validator')

class ServicioController {

  async index({ request, response }) {
    const input = request.all()

    let serviciosQuery = Servicio.query() // No se necesita cargar atributos

    if (input.txtBuscar != undefined) {
      serviciosQuery = serviciosQuery.where('categoria', 'like', '%' + input.txtBuscar + '%')
    }

    const servicios = await serviciosQuery.fetch()

    return response.json({
      res: true,
      data: servicios
    })
  }

  // POST
  async store({ request, response }) {
    const input = request.only(['nombre_servicio', 'descripcion', 'categoria', 'precio'])

    // Validación separada
    const validation = await this.validar(input)
    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    // Crear el servicio con el precio ingresado directamente
    const servicio = await Servicio.create(input)

    return response.json({
      res: true,
      message: 'Servicio creado correctamente',
      data: servicio
    })
  }

  async show({ params, response }) {
    const servicio = await Servicio.findOrFail(params.id)

    return response.json({
      res: true,
      data: servicio
    })
  }

  // PUT
  async update({ params, request, response }) {
    const input = request.only(['nombre_servicio', 'descripcion', 'categoria', 'precio'])

    // Validación separada
    const validation = await this.validar(input)
    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    // Obtener el servicio existente
    const servicio = await Servicio.findOrFail(params.id)

    // Actualizar los campos del servicio
    servicio.merge(input)
    await servicio.save()

    return response.json({
      res: true,
      message: 'Servicio actualizado correctamente',
      data: servicio
    })
  }

  // DELETE
  async destroy({ params, response }) {
    const servicio = await Servicio.findOrFail(params.id)
    await servicio.delete()

    return response.json({
      res: true,
      message: 'Registro eliminado correctamente'
    })
  }

  // Función para validaciones
  async validar(input) {
    return validateAll(input, {
      'nombre_servicio': 'required|min:3|max:50',
      'descripcion': 'required|min:3|max:2000',
      'categoria': 'required|min:4|max:20',
      'precio': 'required|number|min:0'
    })
  }
}

module.exports = ServicioController
