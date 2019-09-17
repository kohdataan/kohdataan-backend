import axios from 'axios'
import sha1 from 'sha1'

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your username',
        },
        unique: {
          args: true,
          msg: 'Email already exists',
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your email address',
        },
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
        allowNull: {
          args: false,
          msg: 'Please enter a password',
        },
        validate: {
          isNotShort: async value => {
            if (value.length < 8) {
              throw new Error('Password should be at least 8 characters')
            }

            // Check if password is found in public pwd leaks
            // using Haveibeenpwned API
            const hash = sha1(value).toUpperCase()
            const first = hash.substring(0, 5)
            const last = hash.substring(5)

            const url = `https://api.pwnedpasswords.com/range/${first}`
            const regex = RegExp(`/^${last}:/`, 'm')

            // Todo: return the resulting text
            const results = await (axios.get(url))

            const isPwned = regex.test(results.data)
            if (isPwned) {
              throw new Error('Your password has been found in a credential ' +
                'leak in an other service according to haveibeenpwned.com. ' +
                'Please never use this password again and change it ' +
                'everywhere you are using it.')
            }
          },
        },
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
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
      tutorialWatched: {
        type: DataTypes.BOOLEAN,
        allowNull: {
          args: false,
          msg: 'Tutorial should be defined as watched or not',
        },
        defaultValue: false,
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
  }
  return User
}
