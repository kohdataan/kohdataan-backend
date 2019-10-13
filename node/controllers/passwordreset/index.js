import model from '../../models'

const { PasswordResetUuid, User } = model

export const handlePasswordResetRequest = (req, res) => {
  const { email } = req.body

  return User.findOne({ where: { email } })
    .then(user => {
      return PasswordResetUuid.create({ userId: user.id })
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Created new database entry with uuid4 token')
          return res.status(201).send({
            success: true,
            message: 'Email found and uuid generated and stored',
          })
        })
        .catch(err => {
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
    })
    .catch(err => {
      return res.status(500).send({
        success: false,
        message: 'Email not found',
        error: err,
      })
    })
}

// Non completed template for handling password reset
export const handlePasswordReset = (req, res) => {
  const { uuid } = req.body

  PasswordResetUuid.findOne({ where: { uuid } })
    .then(passwordResetEntry => {
      // eslint-disable-next-line no-console
      console.log(passwordResetEntry)
      // Here check if the token is still valid, and change the password if so
      return res.status(200).send({
        success: true,
        message: 'Found',
      })
    })
    .catch(err => {
      return res.status(500).send({
        success: false,
        message: 'Given uuid does not match any stored uuids',
        error: err,
      })
    })
}
