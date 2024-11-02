'use strict'
const Atributo = use('App/Models/Atributo')
const TipoVehiculo = use('App/Models/TipoVehiculo')
const Servicio = use('App/Models/Servicio')

const { validateAll } = use('Validator')
const Helpers = use('Helpers')

class AtributoController {

  async index ({ request, response }) {
    const input = request.all()
    if (input.txtBuscar != undefined) {
      return await Atributo.query()
        .where('nombre_atributo', 'like', '%' + input.txtBuscar + '%')
        .fetch()
    }
    return await Atributo.all()
  }

  // POST
  async store ({ request, response }) {
    const input = request.all()

    // Validaciones
    const validation = await this.validar(input)
    if (validation.fails()) {
      return validation.messages()
    }
    await Atributo.create(input)

    return response.json({
      res: true,
      message: "registro insertado correctamente"
    })
  }

  async show ({ params, request, response }) {
    return await Atributo.findOrFail(params.id)
  }

  // PUT
  async update({ params, request, response }) {
    try {
      const input = request.all();
      const atributo = await Atributo.findOrFail(params.id);
      
      // Validar el input
      const validation = await this.validar(input);
      if (validation.fails()) {
        return response.status(400).json(validation.messages());
      }
  
      // Actualizar el atributo y guardar cambios
      atributo.merge(input);
      await atributo.save();
  
      // Obtener servicios relacionados con este atributo
      const servicios = await atributo.servicios().fetch();
  
      for (const servicio of servicios.rows) {
        // Recalcular el precio del servicio incluyendo atributos
        const atributosDelServicio = await servicio.atributos().fetch();
        const totalCostoAtributos = atributosDelServicio.rows.reduce((total, atributo) => total + (atributo.costo_atributo || 0), 0);
        servicio.precio = totalCostoAtributos;
        await servicio.save();
  
        // Actualizar todas las reservas asociadas a este servicio
        const reservasDelServicio = await servicio.reservas().fetch();
        for (const reserva of reservasDelServicio.rows) {
          const tipoVehiculo = await TipoVehiculo.findOrFail(reserva.tipo_vehiculo_id);
  
          // Obtener los atributos de la reserva
          const atributosReserva = await reserva.atributos().fetch();
          const costoAtributosReserva = atributosReserva.rows.reduce((suma, atrib) => suma + (atrib.costo_atributo || 0), 0);
  
          // Calcular el total de la reserva incluyendo el precio actualizado del servicio, costo del vehículo y costos de atributos
          let totalReserva = (servicio.precio || 0) + (tipoVehiculo.costo || 0) + costoAtributosReserva;
  
          reserva.total = totalReserva;
          await reserva.save();
        }
      }
  
      // Actualizar reservas que contienen el atributo editado directamente
      const reservasConAtributo = await atributo.reservas().fetch();
      for (const reserva of reservasConAtributo.rows) {
        const tipoVehiculo = await TipoVehiculo.findOrFail(reserva.tipo_vehiculo_id);
  
        // Obtener el servicio asociado a la reserva
        const servicio = await Servicio.findOrFail(reserva.servicio_id);
  
        // Obtener los atributos de la reserva
        const atributosReserva = await reserva.atributos().fetch();
        const costoAtributosReserva = atributosReserva.rows.reduce((suma, atrib) => suma + (atrib.costo_atributo || 0), 0);
  
        // Calcular el total de la reserva incluyendo el precio del servicio, costo del vehículo y costos de atributos
        let totalReserva = (servicio.precio || 0) + (tipoVehiculo.costo || 0) + costoAtributosReserva;
  
        reserva.total = totalReserva;
        await reserva.save();
      }
  
      return response.json({
        res: true,
        message: "Atributo, servicios relacionados y reservas actualizados correctamente",
        data: atributo
      });
    } catch (error) {
      console.error('Error al actualizar el atributo:', error);
      return response.status(500).json({
        res: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
  

  async destroy ({ params, request, response }) {
    const atributo = await Atributo.findOrFail(params.id)
    await atributo.delete()

    return response.json({
      res: true,
      message: "registro eliminado correctamente"
    })
  }

  async validar(input, id = null){
    return await validateAll(input, {
      'nombre_atributo': 'required|min:3|max:50',
      'costo_atributo': 'required',
    })
  }
}

module.exports = AtributoController