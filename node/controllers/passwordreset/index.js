import uuidv4 from 'uuid/v4'
import model from '../../models'

const { PasswordResetUuid, User } = model

// eslint-disable-next-line import/prefer-default-export
export const handlePasswordResetRequest = (req, res) => {
  const { email } = req.body

  User.findOne({ where: { email } })
    .then(user => {
      const uuid = uuidv4()
      PasswordResetUuid.create({ uuid, userId: user.id }).catch(err => {
        // eslint-disable-next-line no-console
        console.log(
          'Something went wrong while creating database entry for new password reset token'
        )
        return res.status(500).send({
          success: false,
          message: 'Cannot create database entry',
          error: err,
        })
      })

      // eslint-disable-next-line no-console
      console.log('Created new database entry with uuid4 token')
      // eslint-disable-next-line no-console
      console.log(uuid)
      return res.status(200).send({
        success: true,
        message: 'Email found and uuid generated and stored',
        uuid,
      })
    })
    .catch(err => {
      return res.status(500).send({
        success: false,
        message: 'Email not found',
        error: err,
      })
    })
}
