'use strict'

const Servicio = use('App/Models/Servicio')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')
const Atributo = use('App/Models/Atributo')

class ServicioController {
  
  async index ({ request, response }) {
    const input = request.all()
  
    let serviciosQuery = Servicio.query().with('atributos') // Cargar atributos
  
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
 // app/Controllers/Http/ServicioController.js
 async store({ request, response }) {
  const input = request.only(['nombre_servicio', 'descripcion', 'categoria', 'atributo_ids']);

  // Validación
  const validation = await validateAll(input, {
    'nombre_servicio': 'required|min:3|max:50',
    'descripcion': 'required|min:3|max:200',
    'categoria':'required|min:4|max:20',
    'atributo_ids':'required|array'
  });

  if (validation.fails()) {
    return response.status(400).json(validation.messages());
  }

  // Crear el servicio inicialmente sin precio (se calculará después)
  const servicio = await Servicio.create({
    nombre_servicio: input.nombre_servicio,
    descripcion: input.descripcion,
    categoria: input.categoria,
    precio: 0 // Inicialmente en 0
  });

  // Obtener los atributos seleccionados
  const atributos = await Atributo.query().whereIn('id', input.atributo_ids).fetch();

  // Asignar los atributos al servicio
  await servicio.atributos().attach(input.atributo_ids);

  // Calcular el precio total sumando los costos de los atributos seleccionados
  const totalCostoAtributos = atributos.rows.reduce((total, atributo) => total + atributo.costo_atributo, 0);

  // Actualizar el precio del servicio con el total calculado
  servicio.precio = totalCostoAtributos;
  await servicio.save();

  return response.json({
    res: true,
    message: 'Servicio creado correctamente con el precio calculado',
    data: servicio
  });
}

async show ({ params, request, response }) {
  const servicio = await Servicio.query()
    .where('id', params.id)
    .with('atributos') // Cargar atributos
    .firstOrFail()

  return response.json({
    res: true,
    data: servicio
  })
}


  // PUT
  async update ({ params, request, response }) {
    const input = request.only(['nombre_servicio', 'descripcion', 'categoria', 'atributo_ids']);

    // Validación
    const validation = await this.validar(input, params.id);
    if (validation.fails()) {
      return response.status(400).json(validation.messages());
    }

    // Obtener el servicio existente
    const servicio = await Servicio.findOrFail(params.id);

    // Actualizar los campos del servicio
    servicio.nombre_servicio = input.nombre_servicio;
    servicio.descripcion = input.descripcion;
    servicio.categoria = input.categoria;

    // Guardar los cambios del servicio
    await servicio.save();

    // Si hay atributos, sincronizarlos
    if (input.atributo_ids) {
        await servicio.atributos().sync(input.atributo_ids);
    }

    // Calcular y actualizar el precio
    const atributos = await Atributo.query().whereIn('id', input.atributo_ids).fetch();
    const totalCostoAtributos = atributos.rows.reduce((total, atributo) => total + atributo.costo_atributo, 0);
    servicio.precio = totalCostoAtributos;
    await servicio.save();
    

    return response.json({
        res: true,
        message: "Servicio actualizado correctamente",
        data: servicio
    });
}



  async destroy ({ params, request, response }) {
    const servicio = await Servicio.findOrFail(params.id)
    await servicio.delete()

    return response.json({
      res: true,
      message: "registro eliminado correctamente"
    })
  }

  async validar(input, id = null) {
    return await validateAll(input, {
      'nombre_servicio': 'required|min:3|max:50',
      'descripcion': 'required|min:3|max:200',
      'categoria': 'required|min:4|max:20',
      // Cambiar 'atributo_id' a 'atributo_ids' y no requerirlo aquí
      'atributo_ids': 'array', // No es obligatorio, así que no 'required'
      // No incluir 'precio' en la validación
    });
  }
  
}

module.exports = ServicioController
