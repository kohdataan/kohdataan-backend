import db from '../../models/index.js'

const BlockedUsers = db.sequelize.model('BlockedUser')

export const handleBlockingUser = async (req, res) => {
  const userId = req.user.dataValues.id
  if (!userId) {
    return res.status(401).send({
      success: false,
      message: 'User id invalid',
    })
  }
  const { blockedUser } = req.body
  try {
    await BlockedUsers.create({ userId, blockedUser })
    return res.status(201).send({
      success: true,
      message: 'User blocked succesfully',
    })
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong while blocking user',
      error: err,
    })
  }
}

export const handleUnblockingUser = async (req, res) => {
  const userId = req.user.dataValues.id
  if (!userId) {
    return res.status(401).send({
      success: false,
      message: 'User id invalid',
    })
  }
  const { unblockedUser } = req.body
  try {
    await BlockedUsers.destroy({
      where: { userId, blockedUser: unblockedUser },
    })
    return res.status(201).send({
      success: true,
      message: 'User unblocked succesfully',
    })
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong while unblocking user',
      error: err,
    })
  }
}
