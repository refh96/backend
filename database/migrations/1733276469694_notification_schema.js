'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments();
      table.string('type');
      table.text('message');
      table.boolean('is_read').defaultTo(false); // Para marcar las notificaciones como leídas
      table.timestamps();
    });
    
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationSchema
