'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('Users', 'verifiedPhoneNumber', Sequelize.STRING)
      .then(() => {
        return queryInterface.addConstraint('Users', ['verifiedPhoneNumber'], {
          type: 'unique',
          name: 'verified_phone_number_is_unique',
        })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'verifiedPhoneNumber')
  },
}
