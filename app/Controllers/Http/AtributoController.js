'use strict'
const Atributo = use('App/Models/Atributo')
const { validateAll } = use('Validator')

class AtributoController {
  
  // GET: Obtener todos los atributos, con o sin filtro
  async index({ request }) {
    const input = request.all()
    if (input.txtBuscar) {
      return await Atributo.query()
        .where('nombre_atributo', 'like', `%${input.txtBuscar}%`)
        .fetch()
    }
    return await Atributo.all()
  }

  // POST: Crear un nuevo atributo
  async store({ request, response }) {
    const input = request.all()

    // Validaciones
    const validation = await this.validar(input)
    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    await Atributo.create(input)

    return response.json({
      res: true,
      message: 'Atributo creado correctamente'
    })
  }

  // GET: Mostrar un atributo por ID
  async show({ params }) {
    return await Atributo.findOrFail(params.id)
  }

  // PUT: Actualizar un atributo
  async update({ params, request, response }) {
    try {
      const input = request.all()
      const atributo = await Atributo.findOrFail(params.id)

      // Validaciones
      const validation = await this.validar(input)
      if (validation.fails()) {
        return response.status(400).json(validation.messages())
      }

      // Actualizar el atributo
      atributo.merge(input)
      await atributo.save()

      return response.json({
        res: true,
        message: 'Atributo actualizado correctamente',
        data: atributo
      })
    } catch (error) {
      console.error('Error al actualizar el atributo:', error)
      return response.status(500).json({
        res: false,
        message: 'Error interno del servidor',
        error: error.message
      })
    }
  }

  // DELETE: Eliminar un atributo
  async destroy({ params, response }) {
    const atributo = await Atributo.findOrFail(params.id)
    await atributo.delete()

    return response.json({
      res: true,
      message: 'Atributo eliminado correctamente'
    })
  }

  // Función para validaciones
  async validar(input) {
    return await validateAll(input, {
      'nombre_atributo': 'required|min:3|max:50',
      'costo_atributo': 'required|number|min:0',
    })
  }
}

module.exports = AtributoController
