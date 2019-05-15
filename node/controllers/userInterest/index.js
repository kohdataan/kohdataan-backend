import model from '../../models'

const { UserInterest } = model

export const getUserInterests = (req, res) => {
  const { id } = req.user.dataValues

  UserInterest.findAll({
    include: [
      {
        model: model.Interest,
        attributes: ['name'],
        through: { where: { id } },
      },
    ],
    where: {
      userId: id,
    },
  })
    .then(result =>
      res.status(200).send({
        success: true,
        message: 'User found',
        result,
      })
    )
    .catch(err =>
      res.status(500).send({
        success: false,
        message: 'Error occurred',
        err,
      })
    )
}

export const getUserInterest = (req, res) => {
  res.status(501).send('get user interest')
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
      console.log(err)
      res.send(500).send('fail', err)
    })
}

export const updateUserInterest = (req, res) => {
  res.status(501).send('put user interest')
}

export const deleteUserInterest = (req, res) => {
  res.status(501).send('delete user interest')
}
