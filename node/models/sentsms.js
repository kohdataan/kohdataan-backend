module.exports = (sequelize, DataTypes) => {
  const SentSms = sequelize.define(
    'SentSms',
    {
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      smsType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {}
  )
  SentSms.associate = models => {
    // associations can be defined here
  }
  return SentSms
}
