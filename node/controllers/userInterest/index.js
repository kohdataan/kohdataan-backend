import model from '../../models'

const { UserInterest, User, Interest } = model

export const getUserInterests = (req, res) => {
  const { id } = req.user.dataValues

  User.findAll({
    attributes: ['id'],
    where: {
      id,
    },
    include: [
      {
        model: Interest,
        as: 'interests',
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    ],
  })
    .then(result =>
      res.status(200).send({
        success: true,
        message: 'User interests found',
        result,
      })
    )
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Error occurred',
        err,
      })
    })
}

export const getUserInterest = (req, res) => {
  const { username } = req.params

  User.findAll({
    attributes: ['id', 'username'],
    where: {
      username,
    },
    include: [
      {
        model: Interest,
        as: 'interests',
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    ],
  })
    .then(result =>
      res.status(200).send({
        success: true,
        message: 'User interests found',
        result,
      })
    )
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Error occurred',
        err,
      })
    })
}

export const addUserInterest = (req, res) => {
  res.status(501).send('add user interest')
}

export const addUserInterests = (req, res) => {
  const { userId, userInterests } = req.body
  const newInterests = userInterests.map(interestId => {
    return { userId, interestId }
  })

  return UserInterest.sequelize
    .transaction(t => {
      return UserInterest.destroy(
        {
          where: {
            userId,
          },
        },
        { transaction: t }
      ).then(
        () => {
          return UserInterest.bulkCreate(newInterests)
        },
        { transaction: t }
      )
    })
    .then(result => {
      res.status(200).send({
        success: true,
        message: 'User interests succesfully added',
        result,
      })
    })
    .catch(err => {
      res.send(500).send('fail', err)
    })
}

export const updateUserInterest = (req, res) => {
  res.status(501).send('put user interest')
}

export const deleteUserInterest = (req, res) => {
  res.status(501).send('delete user interest')
}
