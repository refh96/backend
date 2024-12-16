'use strict'

const Schema = use('Schema');

class PasswordResetsSchema extends Schema {
  up () {
    this.create('password_resets', (table) => {
      table.increments();
      table.string('email', 254).notNullable();
      table.string('token', 255).notNullable().unique();
      table.timestamp('expires_at').notNullable();
      table.timestamps();
    });
  }

  down () {
    this.drop('password_resets');
  }
}

module.exports = PasswordResetsSchema;
