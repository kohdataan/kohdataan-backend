'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'deleteAt', Sequelize.DATE)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'deleteAt', Sequelize.DATE)
  },
}
