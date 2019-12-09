import model from '../../models'
import sendMail from '../../utils/mailsender'

const { EmailVerificationUuid, User } = model

export const handleEmailVerificationRequest = (req, res) => {
  const { email } = req.body
  let thisUser = null

  return User.findOne({ where: { email } })
    .then(user => {
      thisUser = user
      return EmailVerificationUuid.findOne({ where: { userId: user.id } })
    })
    .then(response => {
      return response || EmailVerificationUuid.create({ userId: thisUser.id })
    })
    .then(createdToken => {
      const emailToSent = `Hei, tästä linkistä pääset kirjautumaan palveluun: 
      \nwww.kohdataan.com/forgotPass?uuid=${createdToken.dataValues.uuid}`
      return sendMail(thisUser.email, 'Kirjautuminen', emailToSent)
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
        message: 'problem with email verification',
        error: err,
      })
    })
}

export const handleEmailVerification = (req, res) => {
  const { uuid } = req.body

  EmailVerificationUuid.findOne({ where: { uuid } })
    .then(emailVerificateEntry => {
      return User.update(
        {
          emailVerified: true,
        },
        {
          where: {
            id: emailVerificateEntry.dataValues.userId,
          },
        }
      )
    })
    .then(response => {
      return res.status(200).send({
        success: true,
        message: 'User email verified',
        response,
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
