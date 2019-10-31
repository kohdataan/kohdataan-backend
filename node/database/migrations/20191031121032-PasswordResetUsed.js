module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PasswordResetUuids', 'used', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PasswordResetUuids', 'used', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },
}
