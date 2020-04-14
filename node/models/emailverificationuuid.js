import uuidv4 from 'uuid/v4'

module.exports = (sequelize, DataTypes) => {
  const EmailVerificationUuid = sequelize.define(
    'EmailVerificationUuid',
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
        unique: {
          args: true,
          msg: 'There is already an entry for this user',
        },
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  )
  EmailVerificationUuid.associate = models => {
    EmailVerificationUuid.belongsTo(models.User, {
      foreignKey: 'userId',
    })
  }

  return EmailVerificationUuid
}
