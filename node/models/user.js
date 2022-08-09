export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username already exists',
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Please enter a valid email address',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNotShort: value => {
            if (value.length < 8) {
              throw new Error('Password should be at least 8 characters')
            }
          },
        },
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'defaultnick',
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      showAge: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      showLocation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      profileReady: {
        type: DataTypes.BOOLEAN,
        allowNull: {
          args: false,
          msg: 'Profile should be defined as ready or not',
        },
        defaultValue: false,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tutorialWatched: {
        type: DataTypes.BOOLEAN,
        allowNull: {
          args: false,
          msg: 'Tutorial should be defined as watched or not',
        },
        defaultValue: false,
      },
      imageUploaded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleteAt: {
        type: DataTypes.DATE,
      },
      channelInvitationsAt: {
        type: DataTypes.DATE,
      },
    },
    {}
  )
  User.associate = models => {
    User.belongsToMany(models.Interest, {
      through: 'UserInterest',
      as: 'interests',
      foreignKey: 'userId',
    })
    User.hasMany(models.BlockedUser, {
      foreignKey: 'userId',
    })
  }
  return User
}
