'use strict'
const Estado = use('App/Models/Estado')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')

class EstadoController {

  async index ({ request, response }) {
    const input = request.all()
    if (input.txtBuscar != undefined) {
      return await Estado.query()
        .where('nombre', 'like', '%' + input.txtBuscar + '%')
        .fetch()
    }
    return await Estado.all()
  }

  // POST
  async store ({ request, response }) {
    const input = request.all()

    // Validaciones
    const validation = await this.validar(input)
    if (validation.fails()) {
      return validation.messages()
    }
    await Estado.create(input)

    return response.json({
      res: true,
      message: "registro insertado correctamente"
    })
  }

  async show ({ params, request, response }) {
    return await Estado.findOrFail(params.id)
  }

  // PUT
  async update ({ params, request, response }) {
    const input = request.all()

    await Estado.query().where('id', params.id).update(input)

    return response.json({
      res: true,
      message: "registro modificado correctamente"
    })
  }

  async destroy ({ params, request, response }) {
    const estado = await Estado.findOrFail(params.id)
    await estado.delete()

    return response.json({
      res: true,
      message: "registro eliminado correctamente"
    })
  }

  async validar(input, id = null){
    return await validateAll(input, {
      'nombre': 'required|min:3|max:50',
      'mensaje': 'required',
    })
  }
}

module.exports = EstadoController