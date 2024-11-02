'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Estado extends Model {
  static get table(){
    return 'estados';
}
    static get hidden () {
        return ['created_at', 'updated_at']
      }
}

module.exports = Estado
