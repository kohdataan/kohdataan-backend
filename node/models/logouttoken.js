module.exports = (sequelize, DataTypes) => {
  const LogoutToken = sequelize.define(
    'LogoutToken',
    {
      token: DataTypes.STRING(1000),
      allowNull: false,
      unique: true,
    },
    {}
  )
  // eslint-disable-next-line no-unused-vars
  LogoutToken.associate = models => {
    // associations can be defined here
  }
  return LogoutToken
}
