'use strict'
const TipoVehiculo = use('App/Models/TipoVehiculo')
const Reserva = use('App/Models/Reserva')
const Servicio = use('App/Models/Servicio')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')

class TipoVehiculoController {

  async index ({ request, response }) {
    const input = request.all()
    if (input.txtBuscar != undefined) {
      return await TipoVehiculo.query()
        .where('nombre', 'like', '%' + input.txtBuscar + '%')
        .fetch()
    }
    return await TipoVehiculo.all()
  }

  // POST
  async store ({ request, response }) {
    const input = request.all()

    // Validaciones
    const validation = await this.validar(input)
    if (validation.fails()) {
      return validation.messages()
    }
    await TipoVehiculo.create(input)

    return response.json({
      res: true,
      message: "registro insertado correctamente"
    })
  }

  async show ({ params, request, response }) {
    return await TipoVehiculo.findOrFail(params.id)
  }

  // PUT
  async update({ params, request, response }) {
    try {
      const input = request.all();
      
      // Validar el input
      const validation = await this.validar(input);
      if (validation.fails()) {
        return response.status(400).json(validation.messages());
      }
  
      // Actualizar el tipo de vehículo y guardar los cambios
      const tipoVehiculo = await TipoVehiculo.findOrFail(params.id);
      tipoVehiculo.merge(input);
      await tipoVehiculo.save();
      /*
      // Obtener todas las reservas que usan este tipo de vehículo
      const reservas = await Reserva.query()
        .where('tipo_vehiculo_id', params.id)
        .fetch();
  
      for (const reserva of reservas.rows) {
        // Obtener el servicio asociado a la reserva
        const servicio = await Servicio.findOrFail(reserva.servicio_id);
  
        // Obtener los atributos de la reserva
        const atributosReserva = await reserva.atributos().fetch();
        const costoAtributosReserva = atributosReserva.rows.reduce((suma, atrib) => 
          suma + (Number(atrib.costo_atributo) || 0), 0
        );
  
        // Calcular el total de la reserva incluyendo el nuevo costo del tipo de vehículo, precio del servicio y costos de atributos
        const totalReserva = 
          (Number(servicio.precio) || 0) +
          (Number(tipoVehiculo.costo) || 0) +
          costoAtributosReserva;
  
        // Asignar el total a la reserva y guardar
        reserva.total = totalReserva;
        await reserva.save();
      }*/
  
      return response.json({
        res: true,
        message: "Tipo de vehículo y reservas asociadas actualizadas correctamente",
        data: tipoVehiculo
      });
    } catch (error) {
      console.error('Error al actualizar el tipo de vehículo:', error);
      return response.status(500).json({
        res: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
  
  async destroy ({ params, request, response }) {
    const tipovehiculo = await TipoVehiculo.findOrFail(params.id)
    await tipovehiculo.delete()

    return response.json({
      res: true,
      message: "registro eliminado correctamente"
    })
  }

  async validar(input, id = null){
    return await validateAll(input, {
      'nombre': 'required|min:3|max:50',
      'costo': 'required',
    })
  }
}

module.exports = TipoVehiculoController
