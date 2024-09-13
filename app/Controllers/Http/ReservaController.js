'use strict'

const Reserva = use('App/Models/Reserva')
const User = use('App/Models/User')
const Servicio = use('App/Models/Servicio')
const { validate } = use('Validator')

class ReservaController {

  async index ({ request, response }) {
    const reservas = await Reserva.query().with('user').with('servicio').fetch()
    return response.json(reservas)
  }

  async store ({ request, response }) {
    const input = request.only(['user_id', 'servicio_id', 'fecha', 'hora', 'estado', 'tipo_vehiculo'])

    // Validaciones
    const validation = await this.validar(input)
    if (!validation.passes()) {
      return response.status(400).json({
        res: false,
        message: validation.messages // Cambiar "validation.messages()" a "validation.messages"
      })
    }

    const reserva = await Reserva.create(input) // Corrección: usar "create" en lugar de "created"

    return response.json({
      res: true,
      message: 'Reserva creada correctamente',
      reserva
    })
  }
  async show ({ params, response }) {
    const reserva = await Reserva.query().where('id', params.id).with('user').with('servicio').firstOrFail()
    return response.json(reserva)
  }

  async update ({ params, request, response }) {
    const input = request.only(['user_id', 'servicio_id', 'fecha', 'hora', 'estado', 'tipo_vehiculo'])
    const reserva = await Reserva.findOrFail(params.id)
    reserva.merge(input)
    await reserva.save()

    return response.json({
      res: true,
      message: 'Reserva actualizada correctamente',
      reserva
    })
  }

  async destroy ({ params, response }) {
    const reserva = await Reserva.findOrFail(params.id)
    await reserva.delete()

    return response.json({
      res: true,
      message: 'Reserva eliminada correctamente'
    })
  }
 async validar(input, id = null) {
  const rules = {
    'user_id': 'required|integer',
    'servicio_id': 'required|integer',
    'fecha': 'required|date',
    // Nueva expresión regular para validar el formato de hora en formato 24 horas (HH:mm:ss)
    'hora': ['required', 'regex:^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'],
    'estado': 'required|string|max:20',
    'tipo_vehiculo': 'required|string|max:50'
  }

  const validation = await validate(input, rules)

  if (validation.fails()) {
    return {
      passes: () => false,
      messages: validation.messages()
    }
  }

  // Validar que user_id y servicio_id existan en la base de datos
  const userExists = await User.find(input.user_id)
  if (!userExists) {
    return {
      passes: () => false,
      messages: [{ field: 'user_id', message: 'El usuario no existe', validation: 'exists' }]
    }
  }

  const servicioExists = await Servicio.find(input.servicio_id)
  if (!servicioExists) {
    return {
      passes: () => false,
      messages: [{ field: 'servicio_id', message: 'El servicio no existe', validation: 'exists' }]
    }
  }
  return { passes: () => true }
}


  async getReservasPorUsuario({ params, response }) {
    const { user_id } = params

    // Verificar si el usuario existe
    const userExists = await User.find(user_id)
    if (!userExists) {
      return response.status(404).json({
        res: false,
        message: 'El usuario no existe'
      })
    }

    // Obtener todas las reservas asociadas al usuario
    const reservas = await Reserva.query().where('user_id', user_id).with('servicio').fetch()
    return response.json({
      res: true,
      reservas
    })
  }
}

module.exports = ReservaController
