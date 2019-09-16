module.exports = (sequelize, DataTypes) => {
  const PasswordResetUuid = sequelize.define(
    'PasswordResetUuid',
    {
      uuid: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {}
  )
  PasswordResetUuid.associate = models => {
    PasswordResetUuid.belongsTo(models.User, {
      foreignKey: 'userId',
    })
  }

  return PasswordResetUuid
}
