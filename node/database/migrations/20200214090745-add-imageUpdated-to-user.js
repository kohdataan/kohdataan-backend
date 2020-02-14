'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'imageUploaded', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'imageUploaded', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    })
  },
}
