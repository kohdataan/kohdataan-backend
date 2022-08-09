import sendMail from '../../utils/mailSender.js'

// eslint-disable-next-line import/prefer-default-export
export const sendMailToSupport = (req, res) => {
  const { name, email, message, type } = req.body

  const messageToSent = `Sender name: ${name} \nsender email: ${email} \nmessage: ${message}`

  sendMail(process.env.EMAIL_USER, type, messageToSent)
    .then(() => {
      res.status(201).send({
        success: true,
        message: 'Message sent',
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Something went wrong',
        err,
      })
    })
}
