'use strict'

const Servicio = use('App/Models/Servicio')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')

class ServicioController {
  
  async index ({ request, response }) {
    const input = request.all()
    if (input.txtBuscar != undefined) {
      return await Servicio.query()
        .where('categoria', 'like', '%' + input.txtBuscar + '%')
        .fetch()
    }
    return await Servicio.all()
  }

  // POST
  async store ({ request, response }) {
    const input = request.all()

    // Validaciones
    const validation = await this.validar(input)
    if (validation.fails()) {
      return validation.messages()
    }
    await Servicio.create(input)

    return response.json({
      res: true,
      message: "registro insertado correctamente"
    })
  }

  async show ({ params, request, response }) {
    return await Servicio.findOrFail(params.id)
  }

  // PUT
  async update ({ params, request, response }) {
    const input = request.all()

    await Servicio.query().where('id', params.id).update(input)

    return response.json({
      res: true,
      message: "registro modificado correctamente"
    })
  }

  async destroy ({ params, request, response }) {
    const servicio = await Servicio.findOrFail(params.id)
    await servicio.delete()

    return response.json({
      res: true,
      message: "registro eliminado correctamente"
    })
  }

  async validar(input, id = null){
    return await validateAll(input, {
      'nombre_servicio': 'required|min:3|max:50',
      'descripcion': 'required|min:3|max:200',
      'categoria':'required|min:4|max:20',
      'precio': 'required'
    })
  }
}

module.exports = ServicioController
