import db from '../models.js'

const sentSms = db.sequelize.model('SentSms')

// TO DO
// Add the actual logic here to send sms

export const sendEmailVerificationSms = async user => {
  await sentSms.create({ phoneNumber: user.phoneNumber, smsType: 1 })
}

export const sendForgotPasswordSms = async user => {
  await sentSms.create({ phoneNumber: user.phoneNumber, smsType: 2 })
}
