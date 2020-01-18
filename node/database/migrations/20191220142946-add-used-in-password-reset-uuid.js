'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PasswordResetUuids', 'used', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PasswordResetUuids', 'used', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    })
  },
}
