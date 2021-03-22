import { v4 as uuidv4 } from 'uuid'

module.exports = (sequelize, DataTypes) => {
  const PasswordResetUuid = sequelize.define(
    'PasswordResetUuid',
    {
      uuid: {
        type: DataTypes.STRING,
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
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
