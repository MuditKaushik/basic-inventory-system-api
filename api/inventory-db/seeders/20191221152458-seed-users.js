'use strict';
var uuid = require('uuid/v4');
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('users', [
      {
        id: uuid(),
        firstName: 'Mudit',
        middleName: 'Mohan',
        lastName: 'Kaushik',
        email: 'mudit@gmail.com',
        username: 'kaushik1988',
        password: 'test123'
      },
      {
        id: uuid(),
        firstName: 'Rewaa',
        middleName: '',
        lastName: 'Technologies',
        email: 'amr.ali@rewaatech.com',
        username: 'amr.ali',
        password: 'rewaa123'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('users', null, {});
  }
};
