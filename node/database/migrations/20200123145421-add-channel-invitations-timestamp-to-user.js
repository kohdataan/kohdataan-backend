'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users',
      'channelInvitationsAt',
      Sequelize.DATE
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users',
      'channelInvitationsAt',
      Sequelize.DATE
    )
  },
}
