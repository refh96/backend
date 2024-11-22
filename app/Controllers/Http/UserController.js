'use strict'

const { type } = require("os");
const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {
  async index({ request, response }) {
    const input = request.all();
    if (input.txtBuscar != undefined) {
      return await User.query()
        .where('username', 'like', '%' + input.txtBuscar + '%')
        .fetch();
    }
    return await User.all();
  }

  // POST
  async store({ request, response }) {
    const input = request.all();

    // Validaciones
    const validation = await this.validar(input);
    if (validation.fails()) {
      return validation.messages();
    }
    await User.create(input);

    return response.json({
      res: true,
      message: "usuario insertado correctamente"
    })
  }

  async show({ params, request, response }) {
    return await User.findOrFail(params.id);
  }

  // PUT
  async update({ params, request, response }) {
    const input = request.all();
    const user = await User.findOrFail(params.id);
  
    // Actualizar solo si el valor existe en input
    user.merge(input);
  
    // Guardar el usuario (esto disparará el hook que hashea la contraseña)
    await user.save();
  
    return response.json({
      res: true,
      message: "Registro modificado correctamente",
    });
  }
  

  async destroy({ params, response }) {
    // Buscar al usuario por su ID
    const user = await User.findOrFail(params.id);
  
    // Eliminar todos los tokens asociados al usuario
    await user.tokens().delete();
  
    // Eliminar el usuario después de borrar los tokens
    await user.delete();
  
    return response.json({
      res: true,
      message: "Usuario eliminado correctamente"
    });
  }
  

  async validar(input, id = null) {
    return await validateAll(input, {
      'username': 'required|min:3|max:20',
      'numero': 'required|min:9|max:15|unique:users,numero',
      'email': 'required|unique:users,email|min:10|max:100',
      'password': 'required'
    })
  }
  async login({ request, response, auth }) {
    let input = request.all();
    let token = await auth.withRefreshToken().attempt(input.email, input.password);
    const user = await User.findBy('email', input.email);
    return response.json({
      res: true,
      token: token,
      rol: user.rol,
      message: 'Bienvenido al sistema',
    })
  }
  async getUser({ auth }) {
    try {
      return await auth.getUser()
    } catch (error) {
      response.send('ningun usuario autenticado')
    }
  }
  async logout({ auth, response }) {
    try {
      await auth.logout();
      return response.json({
        res: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return response.status(500).json({
        res: false,
        message: 'Failed to log out',
        error: error.message
      });
    }
  }
  


  async profile({ auth, response }) {
    try {
      const user = await auth.getUser()
      return response.json({
        res: true,
        user: user
      })
    } catch (error) {
      response.status(401).json({
        res: false,
        message: 'No authenticated user found'
      })
    }
  }
}

module.exports = UserController
