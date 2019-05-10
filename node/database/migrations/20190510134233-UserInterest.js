module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('UserInterests', 'id')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('UserInterests', 'id', {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    })
  },
}
