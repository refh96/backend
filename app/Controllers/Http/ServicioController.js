'use strict'

const Servicio = use('App/Models/Servicio')
const { validateAll } = use('Validator')

class ServicioController {
  // GET: Obtener todos los servicios
  async index({ request, response }) {
    const input = request.all()

    let serviciosQuery = Servicio.query()

    if (input.txtBuscar != undefined) {
      serviciosQuery = serviciosQuery.where('categoria', 'like', `%${input.txtBuscar}%`)
    }

    const servicios = await serviciosQuery.fetch()

    return response.json({
      res: true,
      data: servicios
    })
  }

  // POST: Crear un nuevo servicio
  async store({ request, response }) {
    const input = request.only(['nombre_servicio', 'tiempo_estimado', 'detalles_incluidos', 'categoria', 'precio'])

    const existingServicio = await Servicio.findBy('nombre_servicio', input.nombre_servicio)
    if (existingServicio) {
      return response.status(400).json({
        res: false,
        message: 'El nombre del servicio ya está registrado.'
      })
    }

    // Validación
    const validation = await this.validar(input)
    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const servicio = await Servicio.create(input)

    return response.json({
      res: true,
      message: 'Servicio creado correctamente',
      data: servicio
    })
  }


  // GET: Obtener un servicio por ID
  async show({ params, response }) {
    const servicio = await Servicio.findOrFail(params.id)

    return response.json({
      res: true,
      data: servicio
    })
  }

  // PUT: Actualizar un servicio
  async update({ params, request, response }) {
    const input = request.only(['nombre_servicio', 'tiempo_estimado', 'detalles_incluidos', 'categoria', 'precio'])

    // Validación
    const validation = await this.validar(input)
    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const servicio = await Servicio.findOrFail(params.id)

    servicio.merge(input)
    await servicio.save()

    return response.json({
      res: true,
      message: 'Servicio actualizado correctamente',
      data: servicio
    })
  }


  // DELETE: Eliminar un servicio
  async destroy({ params, response }) {
    const servicio = await Servicio.findOrFail(params.id)
    await servicio.delete()

    return response.json({
      res: true,
      message: 'Servicio eliminado correctamente'
    })
  }

  // Función de validación
  async validar(input) {
    return validateAll(input, {
      'nombre_servicio': 'required|min:3|max:50',
      'tiempo_estimado': 'required|integer|min:1',
      'detalles_incluidos': 'required',
      'categoria': 'required|min:4|max:20',
      'precio': 'required|number|min:0',
    })
  }
}

module.exports = ServicioController
