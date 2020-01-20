import nodemailer from 'nodemailer'

// Change the transport configuration when modifying this function to use smtp server
// Google nodemailer docs.
export default (to, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TESTEMAIL,
      pass: process.env.TESTEMAILPASS,
    },
  })
  return transporter.sendMail({
    from: {
      name: 'Kohdataan',
      address: process.env.TESTEMAIL
    },  
    to,
    subject,
    text: content,
  })
}
