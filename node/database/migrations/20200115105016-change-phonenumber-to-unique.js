'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('Users', 'phoneNumber')
      .then(() => {
        return queryInterface.addColumn(
          'Users',
          'phoneNumber',
          Sequelize.STRING
        )
      })
      .then(() => {
        return queryInterface.addColumn('Users', 'phoneNumberVerified', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        })
      })
      .then(() => {
        return queryInterface.addConstraint(
          'Users',
          ['phoneNumber', 'phoneNumberVerified'],
          {
            type: 'unique',
            name: 'phone_number_and_verification_combo_is_unique',
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('Users', 'phoneNumber')
      .then(() => {
        return queryInterface.addColumn(
          'Users',
          'phoneNumber',
          Sequelize.STRING
        )
      })
      .then(() => {
        return queryInterface.removeColumn(
          'Users',
          'phoneNumberVerified',
          Sequelize.BOOLEAN
        )
      })
  },
}
