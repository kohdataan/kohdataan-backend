import uuidv4 from 'uuid/v4'

module.exports = (sequelize, DataTypes) => {
  const PasswordResetUuid = sequelize.define(
    'PasswordResetUuid',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: () => {
          return uuidv4()
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
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
