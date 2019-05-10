module.exports = (sequelize, DataTypes) => {
  const UserInterest = sequelize.define('UserInterest', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    interestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Interest',
        key: 'id',
      },
    },
  })
  return UserInterest
}
