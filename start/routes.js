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
Route.group(() =>{
  Route.post('logout', 'UserController.logout');
  Route.post('profile', 'UserController.profile');
  Route.resource('reservas', 'ReservaController').apiOnly();
  Route.get('reservas/user/:user_id', 'ReservaController.getReservasPorUsuario');
  Route.post('cargar_foto_antes/:id', 'ReservaController.cargarFotoAntes');
  Route.post('cargar_foto_despues/:id', 'ReservaController.cargarFotoDespues');
}).middleware('auth');
