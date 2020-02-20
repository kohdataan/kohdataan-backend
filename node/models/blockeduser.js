module.exports = (sequelize, DataTypes) => {
  const BlockedUsers = sequelize.define(
    'BlockedUser',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 'Users',
        referencesKey: 'id',
      },
      blockedUser: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  )
  BlockedUsers.associate = models => {
    BlockedUsers.belongsTo(models.User, {
      foreignKey: 'id',
    })
  }
  return BlockedUsers
}
