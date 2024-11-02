'use strict'

const Reserva = use('App/Models/Reserva')
const User = use('App/Models/User')
const Servicio = use('App/Models/Servicio')
const Atributo = use('App/Models/Atributo')
const Estado = use('App/Models/Estado')
const TipoVehiculo = use('App/Models/TipoVehiculo')
const { validate } = use('Validator')
const Helpers = use('Helpers')
const { Resend } = use('resend')
const resend = new Resend('re_gCUYt5bo_9QmceeYiw74BvDyihwnPKZzU');
class ReservaController {

  // Método para calcular el total
  _calcularTotal(servicio, tipoVehiculo) {
    return servicio.precio + tipoVehiculo.costo;
  }

  async store({ request, response }) {
    const input = request.only(['user_id', 'servicio_id', 'fecha', 'hora', 'estado_id', 'tipo_vehiculo_id']);
    const atributoIds = request.input('atributo_ids', []); // Obtenemos atributo_ids aparte para evitar que se guarden en reservas
    // Validaciones
    const validation = await this.validar(input);
    if (!validation.passes()) {
      return response.status(400).json({
        res: false,
        message: validation.messages,
      });
    }

    // Validaciones adicionales
    const validacionAdicional = await this.validacionesAdicionales(input);
    if (!validacionAdicional.passes) {
      return response.status(400).json({
        res: false,
        message: validacionAdicional.message,
      });
    }

    // Obtener el servicio y el tipo de vehículo para calcular el precio
    const servicio = await Servicio.findOrFail(input.servicio_id);
    const tipoVehiculo = await TipoVehiculo.findOrFail(input.tipo_vehiculo_id);

    // Comprobar atributos ya asociados al servicio
    const atributosServicio = await servicio.atributos().fetch();
    const atributosServicioIds = atributosServicio.rows.map(attr => attr.id);

    // Verificar si alguno de los atributos ya está asociado al servicio
    const atributosDuplicados = atributoIds.filter(id => atributosServicioIds.includes(id));
    if (atributosDuplicados.length > 0) {
      // Obtener los nombres de los atributos duplicados
      const atributosDuplicadosNombres = await Atributo.query()
        .whereIn('id', atributosDuplicados)
        .pluck('nombre_atributo'); // Obtener solo los nombres de los atributos

      // Construir el mensaje de error con los nombres
      return response.status(400).json({
        res: false,
        message: 'Los siguientes atributos ya están asociados al servicio: ' + atributosDuplicadosNombres.join(', '),
      });
    }


    // Calcular el total usando la función
    let total = this._calcularTotal(servicio, tipoVehiculo);

    // Agregar el costo de los atributos si se proporcionan
    if (atributoIds.length > 0) {
      const atributos = await Atributo.query().whereIn('id', atributoIds).fetch();
      const totalCostoAtributos = atributos.rows.reduce((suma, atributo) => suma + atributo.costo_atributo, 0);
      total += totalCostoAtributos; // Sumar el costo de los atributos al total
    }

    // Crear la reserva con el total calculado
    input.total = total;
    const reserva = await Reserva.create(input);
    //envia correo de creacion de reserva
    const user = await User.findOrFail(input.user_id);
    const { data, error } = await resend.emails.send({
      from: 'Full Wash Conce <no-reply@fullwash.site>',
      to: [user.email],
      subject: 'Full Wash Conce',
      html: '<strong>Gracias por reservar con nosotros!</strong>',
    });
    if (error) {
      return console.error({ error });
    }
    console.log({ data });

    // Asociar atributos a la reserva si se proporcionaron
    if (atributoIds.length > 0) {
      await reserva.atributos().attach(atributoIds);
    }

    return response.json({
      res: true,
      message: 'Reserva creada correctamente',
      reserva,
    });
  }


  async show({ params, response }) {
    try {
      const reserva = await Reserva.findOrFail(params.id);
      return response.json({
        res: true,
        reserva
      });
    } catch (error) {
      return response.status(404).json({
        res: false,
        message: 'Reserva no encontrada'
      });
    }
  }


  async update({ params, request, response }) {
    const input = request.only(['user_id', 'servicio_id', 'fecha', 'hora', 'estado_id', 'tipo_vehiculo_id']);
    const atributoIds = request.input('atributo_ids', []); // Obtenemos atributo_ids aparte
    const reserva = await Reserva.findOrFail(params.id);

    // Validaciones
    const validation = await this.validar(input);
    if (!validation.passes()) {
      return response.status(400).json({
        res: false,
        message: validation.messages,
      });
    }

    // Validaciones adicionales
    const validacionAdicional = await this.validacionesAdicionales(input, reserva.id);
    if (!validacionAdicional.passes) {
      return response.status(400).json({
        res: false,
        message: validacionAdicional.message,
      });
    }

    // Obtener el servicio y el tipo de vehículo para calcular el precio
    const servicio = await Servicio.findOrFail(input.servicio_id);
    const tipoVehiculo = await TipoVehiculo.findOrFail(input.tipo_vehiculo_id);
    // Comprobar atributos ya asociados al servicio
    const atributosServicio = await servicio.atributos().fetch();
    const atributosServicioIds = atributosServicio.rows.map(attr => attr.id);

    // Verificar si alguno de los atributos ya está asociado al servicio
    const atributosDuplicados = atributoIds.filter(id => atributosServicioIds.includes(id));
    if (atributosDuplicados.length > 0) {
      // Obtener los nombres de los atributos duplicados
      const atributosDuplicadosNombres = await Atributo.query()
        .whereIn('id', atributosDuplicados)
        .pluck('nombre_atributo'); // Obtener solo los nombres de los atributos

      // Construir el mensaje de error con los nombres
      return response.status(400).json({
        res: false,
        message: 'Los siguientes atributos ya están asociados al servicio: ' + atributosDuplicadosNombres.join(', '),
      });
    }


    // Calcular el total usando la función
    let total = this._calcularTotal(servicio, tipoVehiculo);

    // Agregar el costo de los atributos si se proporcionan
    if (atributoIds.length > 0) {
      const atributos = await Atributo.query().whereIn('id', atributoIds).fetch();
      const totalCostoAtributos = atributos.rows.reduce((suma, atributo) => suma + atributo.costo_atributo, 0);
      total += totalCostoAtributos; // Sumar el costo de los atributos al total
    }

    // Actualizar la reserva con el total calculado
    input.total = total;
    reserva.merge(input);
    await reserva.save();

    // Actualizar los atributos asociados
    if (atributoIds.length > 0) {
      await reserva.atributos().sync(atributoIds); // Sincroniza los atributos
    }

    // Obtener el usuario y el estado para el correo de notificación
    const user = await User.findOrFail(input.user_id);
    const estado = await Estado.findOrFail(input.estado_id); // Obtener el estado actualizado

    // Enviar correo con el mensaje del nuevo estado
    const { data, error } = await resend.emails.send({
      from: 'Full Wash Conce <no-reply@fullwash.site>',
      to: [user.email],
      subject: 'Actualización de Estado de su Reserva',
      html: `<strong>El estado de su reserva ha cambiado a: ${estado.nombre}</strong><br><p>${estado.mensaje}</p>`,
    });

    if (error) {
      return console.error({ error });
    }
    console.log({ data });

    return response.json({
      res: true,
      message: 'Reserva actualizada correctamente',
      reserva,
    });
  }

  async destroy({ params, response }) {
    const reserva = await Reserva.findOrFail(params.id)
    await reserva.delete()

    return response.json({
      res: true,
      message: 'Reserva eliminada correctamente'
    })
  }

  // Validaciones estándar
  async validar(input, id = null) {
    const rules = {
      'user_id': 'required|integer',
      'servicio_id': 'required|integer',
      'fecha': 'required|date',
      'hora': ['required', 'regex:^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'],
      'estado_id': 'required|integer',
      'tipo_vehiculo_id': 'required|integer'
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

  // Validaciones adicionales
  async validacionesAdicionales(input, reservaId = null) {
    // Convertir la hora a formato 24h para comparar
    const hora = parseInt(input.hora.split(':')[0])

    // Verificar que la hora esté entre las 9 AM y las 6 PM (18:00)
    if (hora < 9 || hora > 18) {
      return { passes: false, message: 'Las reservas solo pueden realizarse entre las 9:00 AM y las 6:00 PM' }
    }

    // Convertir la fecha de input a objeto Date
    const fechaReserva = new Date(input.fecha)

    // Verificar si la fecha corresponde a un domingo
    const diaSemana = fechaReserva.getUTCDay()
    if (diaSemana === 0) { // El valor correcto para domingo es 0
      return { passes: false, message: 'No se pueden realizar reservas los domingos' }
    }

    // Verificar si ya existe una reserva en la misma fecha y hora (excepto la que estamos editando)
    const reservaExistente = await Reserva.query()
      .where('fecha', input.fecha)
      .where('hora', input.hora)
      .whereNot('id', reservaId) // Excluir la reserva actual en caso de edición
      .first()

    if (reservaExistente) {
      return { passes: false, message: 'Ya existe una reserva en esta fecha y hora' }
    }

    return { passes: true }
  }
  // Método para obtener todas las reservas
  async index({ response }) {
    const reservas = await Reserva.query().with('servicio').with('tipo_vehiculo').with('user').with('estado').with('atributos').fetch()
    return response.json({
      res: true,
      reservas
    })
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
    const reservas = await Reserva.query().where('user_id', user_id).with('servicio').with('tipo_vehiculo').with('user').with('estado').with('atributos').fetch()
    return response.json({
      res: true,
      reservas
    })
  }

  async cargarFotoAntes({ request, response, params }) {
    const avatar = request.file('avatar', {
      types: ['image'],
      size: '2mb'
    })
    const nombreArchivo = params.id + "." + avatar.extname
    await avatar.move('./public/antes', {
      name: nombreArchivo,
      overwrite: true
    })
    if (!avatar.moved()) {
      return response.status(422).send({
        res: false,
        message: avatar.error()
      })
    }
    const reserva = await Reserva.findOrFail(params.id)
    reserva.url_antes = nombreArchivo
    await reserva.save()

    return response.json({
      res: true,
      message: 'foto registrada correctamente'
    })
  }
  async cargarFotoDespues({ request, response, params }) {
    const avatar = request.file('avatar', {
      types: ['image'],
      size: '2mb'
    })
    const nombreArchivo = params.id + "." + avatar.extname
    await avatar.move('./public/despues', {
      name: nombreArchivo,
      overwrite: true
    })
    if (!avatar.moved()) {
      return response.status(422).send({
        res: false,
        message: avatar.error()
      })
    }
    const reserva = await Reserva.findOrFail(params.id)
    reserva.url_despues = nombreArchivo
    await reserva.save()

    return response.json({
      res: true,
      message: 'foto registrada correctamente'
    })
  }


  async verFotoAntes({ params, response }) {
    const filepath = Helpers.publicPath('antes/' + params.filename)
    return response.download(filepath)
  }
  async verFotoDespues({ params, response }) {
    const filepath = Helpers.publicPath('despues/' + params.filename)
    return response.download(filepath)
  }
}

module.exports = ReservaController
