module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('Users', 'nickname', Sequelize.STRING)
      .then(() => {
        return queryInterface.addColumn('Users', 'location', Sequelize.STRING)
      })
      .then(() => {
        return queryInterface.addColumn(
          'Users',
          'description',
          Sequelize.STRING
        )
      })
      .then(() => {
        return queryInterface.addColumn('Users', 'profileReady', {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        })
      })
      .then(() => {
        return queryInterface.addColumn('Users', 'tutorialWatched', {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('Users', 'nickname', Sequelize.STRING)
      .then(() => {
        return queryInterface.removeColumn(
          'Users',
          'location',
          Sequelize.STRING
        )
      })
      .then(() => {
        return queryInterface.removeColumn(
          'Users',
          'description',
          Sequelize.STRING
        )
      })
      .then(() => {
        return queryInterface.removeColumn('Users', 'profileReady', {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        })
      })
      .then(() => {
        return queryInterface.removeColumn('Users', 'tutorialWatched', {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        })
      })
  },
}
