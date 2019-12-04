/* eslint-disable import/prefer-default-export */
import nodemailer from 'nodemailer'

export const mailFromRegProb = async (req, res) => {
  const { name, email, message } = req.body
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TESTEMAIL,
      pass: process.env.TESTEMAILPASS,
    },
  })
  try {
    await transporter.sendMail({
      from: process.env.TESTEMAIL,
      to: process.env.TESTEMAIL, // replace address with the mail address you want the messages to be sent
      subject: 'Ongelma kirjautumisessa',
      text: `Käyttäjän nimi ${name}, osoite ${email} viesti ${message}`,
      html: `<body>
            <p>Käyttäjän nimi: ${name}</p>
            <p>Osoite: ${email}</p>
            <hr />
            <p>${message}</p>
          </body>`,
    })
    res.status(201).send({
      success: true,
      message: 'Message sent',
    })
  } catch (error) {
    console.log(error)
  }
}
