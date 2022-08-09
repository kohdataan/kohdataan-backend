export default (sequelize, DataTypes) => {
  const Interest = sequelize.define(
    'Interest',
    {
      name: DataTypes.STRING,
    },
    {}
  )
  Interest.associate = models => {
    Interest.belongsToMany(models.User, {
      through: 'UserInterest',
      as: 'User',
      foreignKey: 'interestId',
    })
    // associations can be defined here
  }
  return Interest
}
