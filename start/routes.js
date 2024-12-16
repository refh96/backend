'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.resource('users', 'UserController').apiOnly();
Route.post('login', 'UserController.login');
Route.resource('servicios', 'ServicioController').apiOnly();
Route.resource('atributos', 'AtributoController').apiOnly();
Route.resource('estados', 'EstadoController').apiOnly();
Route.resource('tipo_vehiculos', 'TipoVehiculoController').apiOnly();
const Helpers = use('Helpers')
Route.get('/antes/:filename', async ({ params, response }) => {
  const filepath = Helpers.publicPath('antes/' + params.filename)
  response.download(filepath)
})
Route.get('/despues/:filename', async ({ params, response }) => {
  const filepath = Helpers.publicPath('despues/' + params.filename)
  response.download(filepath)
})
Route.get('antes/:filename', 'ReservaController.verFoto');
Route.get('despues/:filename', 'ReservaController.verFoto1');
// Ruta para solicitar el correo de recuperación de contraseña
Route.post('forgot-password', 'UserController.forgotPassword');

// Ruta para restablecer la contraseña
Route.post('reset-password', 'UserController.resetPassword');


Route.group(() =>{
  Route.post('logout', 'UserController.logout');
  Route.post('profile', 'UserController.profile');
  Route.resource('reservas', 'ReservaController').apiOnly();
  Route.get('reservas/user/:user_id', 'ReservaController.getReservasPorUsuario');
  Route.post('cargar_foto_antes/:id', 'ReservaController.cargarFotoAntes');
  Route.post('cargar_foto_despues/:id', 'ReservaController.cargarFotoDespues');
  Route.get('/notifications', async ({ request, response }) => {
    const Notification = use('App/Models/Notification');
  
    // Obtener solo las notificaciones no leídas
    const notifications = await Notification.query()
      .where('is_read', false)
      .orderBy('created_at', 'desc')
      .fetch();
  
    return response.json(notifications);
  });
  Route.get('/notifications/read', async ({ request, response }) => {
    const Notification = use('App/Models/Notification');
  
    // Obtener solo las notificaciones leídas
    const notifications = await Notification.query()
      .where('is_read', true)
      .orderBy('created_at', 'desc')
      .fetch();
  
    return response.json(notifications);
  });
  Route.get('/notifications/all', async ({ request, response }) => {
    const Notification = use('App/Models/Notification');
  
    // Obtener todas las notificaciones (leídas y no leídas)
    const notifications = await Notification.query()
      .orderBy('created_at', 'desc')
      .fetch();
  
    return response.json(notifications);
  });
  
  
  Route.post('/notifications/mark-as-read', async ({ request, response }) => {
    const Notification = use('App/Models/Notification');
    const { ids } = request.post();
  
    await Notification.query().whereIn('id', ids).update({ is_read: true });
  
    return response.json({ message: 'Notificaciones marcadas como leídas.' });
  });
  
}).middleware('auth');
