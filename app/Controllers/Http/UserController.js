'use strict'

const { type } = require("os");
const User = use('App/Models/User')
const { validateAll } = use('Validator')
const crypto = require('crypto');
const Database = use('Database');
const { Resend } = require('resend');
const resend = new Resend('re_gCUYt5bo_9QmceeYiw74BvDyihwnPKZzU');


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
  
  // Solicitar recuperación de contraseña
  async forgotPassword({ request, response }) {
    const { email } = request.all();
    const user = await User.findBy('email', email);

    if (!user) {
      return response.status(404).json({
        res: false,
        message: 'Usuario no encontrado',
      });
    }

    // Generar token y fecha de expiración
    const token = crypto.randomBytes(20).toString('hex');
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // 1 hora de validez

    // Guardar token en la tabla `password_resets`
    await Database.table('password_resets').insert({
      email: user.email,
      token: token,
      expires_at: expiration,
    });

    // Enviar correo con el token
    const { error } = await resend.emails.send({
      from: 'Full Wash Conce <no-reply@fullwash.site>',
      to: [user.email],
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hola ${user.username},</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="http://localhost:3000/reset-password?token=${token}">Restablecer Contraseña</a>
        <p>Este enlace es válido por una hora.</p>
      `,
    });

    if (error) {
      return response.status(500).json({
        res: false,
        message: 'Error al enviar el correo de recuperación',
        error,
      });
    }

    return response.json({
      res: true,
      message: 'Correo de recuperación enviado',
    });
  }

  // Restablecer contraseña
  async resetPassword({ request, response }) {
    const { token, password } = request.all();

    // Verificar el token y su expiración
    const resetEntry = await Database.table('password_resets')
      .where('token', token)
      .where('expires_at', '>', new Date())
      .first();

    if (!resetEntry) {
      return response.status(400).json({
        res: false,
        message: 'Token inválido o expirado',
      });
    }

    // Actualizar la contraseña del usuario
    const user = await User.findBy('email', resetEntry.email);
    if (!user) {
      return response.status(404).json({
        res: false,
        message: 'Usuario no encontrado',
      });
    }

    user.password = password;
    await user.save();

    // Eliminar el token usado
    await Database.table('password_resets')
      .where('token', token)
      .delete();

    return response.json({
      res: true,
      message: 'Contraseña restablecida correctamente',
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
