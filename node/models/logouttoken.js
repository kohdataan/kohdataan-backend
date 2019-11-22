module.exports = (sequelize, DataTypes) => {
  const logoutToken = sequelize.define(
    'logoutToken',
    {
      token: DataTypes.STRING(1000),
    },
    {}
  )
  logoutToken.associate = models => {
    // associations can be defined here
  }

  return logoutToken
}
