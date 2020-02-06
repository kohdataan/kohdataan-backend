import nodemailer from 'nodemailer'

// To use Google nodemailer, use service: 'gmail'
export default (to, subject, content) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    },
  })
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: content,
  })
}
