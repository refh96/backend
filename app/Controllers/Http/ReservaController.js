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
const Notification = use('App/Models/Notification');
class ReservaController {

  // Método para calcular el total
  _calcularTotal(servicio, costoVehiculoAjustado) {
    return servicio.precio + costoVehiculoAjustado;
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

    
    // Ajuste del costo del tipo de vehículo según el servicio
    let costoVehiculoAjustado = tipoVehiculo.costo;

    // Sumar costo adicional según el tipo de servicio
    
     if (servicio.nombre_servicio === "Lavado Detailing" && tipoVehiculo.id === 2) {
        costoVehiculoAjustado += 40000; 
    } else if (servicio.nombre_servicio === "Lavado Detailing" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 80000;
    }else if (servicio.nombre_servicio === "Lavado de Tapices" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Lavado de Tapices" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 15000;
    }else if (servicio.nombre_servicio === "Lavado de Alfombra" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Limpieza de Chasis" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 10000;
    }else if (servicio.nombre_servicio === "Limpieza de Chasis" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Pulido Basico" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 50000;
    }else if (servicio.nombre_servicio === "Pulido Basico" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 95000;
    }else if (servicio.nombre_servicio === "Pulido Avanzado" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 45000;
    }else if (servicio.nombre_servicio === "Pulido Avanzado" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 90000;
    }


    // Calcular el total usando la función
    let total = this._calcularTotal(servicio, costoVehiculoAjustado);

    // Agregar el costo de los atributos si se proporcionan
    if (atributoIds.length > 0) {
      const atributos = await Atributo.query().whereIn('id', atributoIds).fetch();
      const totalCostoAtributos = atributos.rows.reduce((suma, atributo) => suma + atributo.costo_atributo, 0);
      total += totalCostoAtributos; // Sumar el costo de los atributos al total
    }
    // Obtener los nombres de los atributos
    let nombresAtributos = '';
    if (atributoIds.length > 0) {
      const atributos = await Atributo.query().whereIn('id', atributoIds).pluck('nombre_atributo');
      nombresAtributos = atributos.join(', '); // Combinar los nombres en una cadena
    }


    // Crear la reserva con el total calculado
    input.total = total;
    const reserva = await Reserva.create(input);

    // Obtener el usuario
    const user = await User.findOrFail(input.user_id);
    
    await Notification.create({
      type: 'create',
      message: `La reserva para el usuario ${user.username} con el servicio ${servicio.nombre_servicio} ha sido creada.`,
    });



    //envia correo de creacion de reserva
    const estado = await Estado.findOrFail(input.estado_id); // Obtener el estado actualizado
    const { data, error } = await resend.emails.send({
      from: 'Full Wash Conce <no-reply@fullwash.site>',
      to: [user.email],
      subject: 'Full Wash Conce',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <h1 style="color: #333; margin-bottom: 10px;">¡Gracias por reservar con Full Wash Conce!</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #555;">Estimado/a <strong>${user.username}</strong>,</p>
        <p style="font-size: 16px; color: #555;">Nos complace informarte que tu reserva ha sido creada exitosamente. Aquí tienes los detalles de tu reserva:</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #e6f7ff; border-radius: 5px;">
          <p style="font-size: 16px; color: #333;"><strong>${reserva.fecha}</strong> [Fecha de la reserva]</p>
          <p style="font-size: 16px; color: #333;"><strong>${reserva.hora}</strong> [Hora de la reserva]</p>
          <p style="font-size: 16px; color: #333;"><strong>${servicio.nombre_servicio}</strong> [Nombre del servicio]</p>
          <p style="font-size: 16px; color: #333;"><strong>${nombresAtributos}</strong> [servicios extra]</p>
          <p style="font-size: 16px; color: #333;"><strong>El estado de su reserva es: ${estado.nombre}</strong><br><p>${estado.mensaje}</p>
          <p style="font-size: 16px; color: #333;"><strong>${reserva.total}</strong> [Costo Total]</p>
        </div>
        <p style="font-size: 16px; color: #555;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p style="font-size: 16px; color: #555;">
          Puedes hacerlo a través de nuestro 
          <a href="https://wa.me/56992646017" style="color: #0f8b8d; text-decoration: none;" target="_blank">WhatsApp</a>.
        </p>
        <p style="font-size: 16px; color: #555;">¡Te esperamos!</p>
      </div>
      <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #777;">
        Full Wash Conce &copy; 2024. Todos los derechos reservados.
      </div>
    </div>`,
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

    // Ajuste del costo del tipo de vehículo según el servicio
    let costoVehiculoAjustado = tipoVehiculo.costo;

    // Sumar costo adicional según el tipo de servicio
    
     if (servicio.nombre_servicio === "Lavado Detailing" && tipoVehiculo.id === 2) {
        costoVehiculoAjustado += 40000; 
    } else if (servicio.nombre_servicio === "Lavado Detailing" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 80000; // Sumar 5 mil para Lavado Premium
    }else if (servicio.nombre_servicio === "Lavado de Tapices" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Lavado de Tapices" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 15000;
    }else if (servicio.nombre_servicio === "Lavado de Alfombra" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Limpieza de Motor" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Limpieza de Motor" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Limpieza de Chasis" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Limpieza de Chasis" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 5000;
    }else if (servicio.nombre_servicio === "Pulido Basico" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 50000;
    }else if (servicio.nombre_servicio === "Pulido Basico" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 95000;
    }else if (servicio.nombre_servicio === "Pulido Avanzado" && tipoVehiculo.id === 2) {
      costoVehiculoAjustado += 45000;
    }else if (servicio.nombre_servicio === "Pulido Avanzado" && tipoVehiculo.id === 3) {
      costoVehiculoAjustado += 90000;
    }



    // Calcular el total usando la función
    let total = this._calcularTotal(servicio, costoVehiculoAjustado) ;

    // Agregar el costo de los atributos si se proporcionan
    if (atributoIds.length > 0) {
      const atributos = await Atributo.query().whereIn('id', atributoIds).fetch();
      const totalCostoAtributos = atributos.rows.reduce((suma, atributo) => suma + atributo.costo_atributo, 0);
      total += totalCostoAtributos; // Sumar el costo de los atributos al total
    }
    let nombresAtributos = '';
    if (atributoIds.length > 0) {
      const atributos = await Atributo.query().whereIn('id', atributoIds).pluck('nombre_atributo');
      nombresAtributos = atributos.join(', '); // Combinar los nombres en una cadena
    }


    // Actualizar la reserva con el total calculado
    input.total = total;
    reserva.merge(input);
    await reserva.save();

    // Actualizar los atributos asociados
    
    await reserva.atributos().sync(atributoIds); // Sincroniza los atributos
    

     // Obtener el usuario
     const user = await User.findOrFail(input.user_id);
     await Notification.create({
       type: 'create',
       message: `La reserva para el usuario ${user.username} con el servicio ${servicio.nombre_servicio} ha sido Editada.`,
     });

    // Obtener el usuario y el estado para el correo de notificación
    const estado = await Estado.findOrFail(input.estado_id); // Obtener el estado actualizado

    // Enviar correo con el mensaje del nuevo estado
    const { data, error } = await resend.emails.send({
      from: 'Full Wash Conce <no-reply@fullwash.site>',
      to: [user.email],
      subject: 'Actualización de Estado de su Reserva',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
              <h1 style="color: #333; margin-bottom: 10px;">¡Su reserva a sido actualizada!</h1>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #555;">Estimado/a <strong>${user.username}</strong>,</p>
              <p style="font-size: 16px; color: #555;">Le informamos que su reserva a sido actualizada. Aquí tienes los detalles:</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #e6f7ff; border-radius: 5px;">
              <p style="font-size: 16px; color: #333;"><strong>El estado de su reserva ha cambiado a: ${estado.nombre}</strong><br><p>${estado.mensaje}</p>
              <p style="font-size: 16px; color: #333;"><strong>${reserva.fecha}</strong> [Fecha de la reserva]</p>
              <p style="font-size: 16px; color: #333;"><strong>${reserva.hora}</strong> [Hora de la reserva]</p>
              <p style="font-size: 16px; color: #333;"><strong>${servicio.nombre_servicio}</strong> [Nombre del servicio]</p>
              <p style="font-size: 16px; color: #333;"><strong>${nombresAtributos}</strong> [servicios extra]</p>
              <p style="font-size: 16px; color: #333;"><strong>${reserva.total}</strong> [Costo Total]</p>
            </div>
              <p style="font-size: 16px; color: #555;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
              <p style="font-size: 16px; color: #555;">
                Puedes hacerlo a través de nuestro 
              <a href="https://wa.me/56992646017" style="color: #0f8b8d; text-decoration: none;" target="_blank">WhatsApp</a>.
              </p>
              <p style="font-size: 16px; color: #555;">¡Te esperamos!</p>
            </div>
            <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #777;">
              Full Wash Conce &copy; 2024. Todos los derechos reservados.
            </div>
            </div>`,
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

     // Obtener el usuario
     const user = await User.findOrFail(reserva.user_id);
     const servicio = await Servicio.findOrFail(reserva.servicio_id);

     await Notification.create({
       type: 'create',
       message: `La reserva para el usuario ${user.username} con el servicio ${servicio.nombre_servicio} ha sido Eliminada.`,
     });

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
