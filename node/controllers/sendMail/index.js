import sendMail from '../../utils/mailSender'

// Place all endpoints here that only send email when frontend calls them

// eslint-disable-next-line import/prefer-default-export
export const sendMailToSupport = (req, res) => {
  const { name, email, message } = req.body

  const messageToSent = `Sender name: ${name} \nsender email: ${email} \nmessage: ${message}`

  // UPDATE RECEIVER OF THIS EMAIL TO BE THE ONE THAT HANDLES PROBLEMS
  sendMail(process.env.TESTEMAIL, 'Ongelma kirjautumisessa', messageToSent)
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
