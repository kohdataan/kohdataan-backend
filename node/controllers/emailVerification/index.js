import db from '../../models'
import sendMail from '../../utils/mailSender'

const EmailVerificationUuid = db.sequelize.model('EmailVerificationUuid')
const User = db.sequelize.model('User')

export const handleEmailVerificationRequest = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (user.emailVerified) {
      return res.status(201).send({
        success: false,
        message: 'This account is already verified',
      })
    }
    let verificationUuid = await EmailVerificationUuid.findOne({
      where: { userId: user.id },
    })
    if (!verificationUuid) {
      verificationUuid = await EmailVerificationUuid.create({ userId: user.id })
    }
    const emailToSent = `Hei, tästä linkistä pääset kirjautumaan palveluun: 
      \n${process.env.FRONTEND_URL}/login/${verificationUuid.uuid}`
    sendMail(user.email, 'Kirjautuminen', emailToSent)
    return res.status(201).send({
      success: true,
      message: 'Email verification link sent',
    })
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong while creating emailVerification token',
      error: err,
    })
  }
}

export const handleEmailVerification = async (req, res) => {
  const { uuid } = req.body

  try {
    const verificationUuid = await EmailVerificationUuid.findOne({
      where: { uuid },
    })
    await User.update(
      {
        emailVerified: true,
      },
      {
        where: {
          id: verificationUuid.userId,
        },
      }
    )
    await verificationUuid.destroy()
    return res.status(200).send({
      success: true,
      message: 'User email verified',
    })
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: 'Given uuid does not match any stored uuids',
      error: err,
    })
  }
}
