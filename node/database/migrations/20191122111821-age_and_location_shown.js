'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('Users', 'showAge', Sequelize.BOOLEAN)
      .then(() => {
        return queryInterface.addColumn(
          'Users',
          'showLocation',
          Sequelize.BOOLEAN
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('Users', 'showAge', Sequelize.BOOLEAN)
      .then(() => {
        return queryInterface.removeColumn(
          'Users',
          'showLocation',
          Sequelize.BOOLEAN
        )
      })
  },
}
