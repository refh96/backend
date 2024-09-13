'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Servicio extends Model {
    static get table(){
        return 'servicios';
    }

    static get hidden(){
        return ['created_at','updated_at']
    }
}

module.exports = Servicio