import db from '../../models'
import sendMail from '../../utils/mailSender'

const EmailVerificationUuid = db.sequelize.model('EmailVerificationUuid')
const User = db.sequelize.model('User')

export const handleEmailVerificationRequest = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (user.emailVerified) {
      return res.status(400).send({
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
    const emailToSend = `<p>Hei!</p>
    <p>Kiitos rekisteröitymisestäsi Kohdataan-palveluun.</p>
    <p><a href="${process.env.FRONTEND_URL}/login/${
      verificationUuid.uuid
    }/">Tästä linkistä</a> pääset vahvistamaan sähköpostisi ja kirjautumaan palveluun.</p>
    <p>Jos tarvitset apua rekisteröitymisessä tai kirjautumisessa, vastaa tähän sähköpostiin ja kerro lisää.</p>
    <p>Jos et ole rekisteröitynyt palveluun, sinun ei tarvitse tehdä mitään.</p>
    <p>Voit kuitenkin aina ottaa meihin yhteyttä, jos epäilet, että sähköpostiasi käytetään väärin.</p>
    <p>Kohdataan  <span>&#128420;</span></p>`
    sendMail(user.email, 'Kohdataan / Rekisteröityminen', emailToSend)
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
    if (!verificationUuid) {
      return res.status(400).send({
        success: false,
        message: 'Given uuid does not match any stored uuids',
      })
    }
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
      message: 'Something went wrong',
      error: err,
    })
  }
}
