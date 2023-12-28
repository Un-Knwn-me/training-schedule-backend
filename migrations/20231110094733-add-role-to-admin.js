'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Admins', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'admin',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Admins', 'role');
  }
};
