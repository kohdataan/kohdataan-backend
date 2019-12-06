import model from '../../models'
import sendMail from '../../utils/mailsender'

const { EmailVerificationUuid, User } = model

// eslint-disable-next-line import/prefer-default-export
export const handleEmailVerificationRequest = (req, res) => {
  const { email } = req.body
  let thisUser = null

  return User.findOne({ where: { email } })
    .then(user => {
      thisUser = user
      return EmailVerificationUuid.findOne({ where: {userId: user.id} })
     // return EmailVerificationUuid.create({ userId: user.id })
    })
    .then(response => {
      return response || EmailVerificationUuid.create({ userId: thisUser.id })
    })
    .then(createdToken => {
      const emailToSent = `Hei, meille tuli pyyntö resetoida salasanasi, tässä linkki josta pääset tekemään sen: 
      \nwww.kohdataan.com/forgotPass?uuid=${createdToken.dataValues.uuid}`
      return sendMail(thisUser.email, 'PasswordResetLink', emailToSent)
    })
    .then(response => {
      return res.status(201).send({
        success: true,
        message: 'Email verificarion link sent',
        response: response.response,
      })
    })
    .catch(err => {
      return res.status(500).send({
        success: false,
        message: 'problem ',
        error: err,
      })
    })
}
/** 
export const handleEmailVerification = (req, res) => {
  const { uuid } = req.body

  EmailVerificationUuid.findOne({ where: { uuid } })
    .then(emailVerificateEntry => {
      // eslint-disable-next-line no-console
      console.log(emailVerificateEntry)
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
} */
