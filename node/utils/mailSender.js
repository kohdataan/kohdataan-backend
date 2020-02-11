import nodemailer from 'nodemailer'

// To use Google nodemailer, use service: 'gmail'
export default (to, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: content,
  })
}
