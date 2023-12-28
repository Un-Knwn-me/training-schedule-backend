'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Students', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'student',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Students', 'role');
  }
};
