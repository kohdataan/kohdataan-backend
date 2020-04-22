'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('EmailVerificationUuids', 'used', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('EmailVerificationUuids', 'used', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    })
  },
}
