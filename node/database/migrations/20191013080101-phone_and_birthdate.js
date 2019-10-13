'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('Users', 'phoneNumber', {
        allowNull: false,
        defaultValue: 'noNumbeYet',
        type: Sequelize.STRING,
      })
      .then(() => {
        return queryInterface.addColumn('Users', 'birthdate', Sequelize.DATE)
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('Users', 'phoneNumber', {
        allowNull: false,
        defaultValue: 'noNumbeYet',
        type: Sequelize.STRING,
      })
      .then(() => {
        return queryInterface.removeColumn('Users', 'birthdate', Sequelize.DATE)
      })
  }
}
