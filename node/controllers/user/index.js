import bcrypt from 'bcrypt'
import model from '../../models'

const { User } = model

export const getUsers = (req, res) => {
  return User.findAll().then(users =>
    res.status(200).send({
      users,
    })
  )
}

export const getUser = (req, res) => {
  res.status(501).send('get user')
}

export const addUser = async (req, res) => {
  console.log(req.body)
  const { username, email, password } = req.body

  const hashed = bcrypt.hashSync(password, 12)

  return User.create({
    username,
    email,
    password: hashed,
  })
    .then(userData =>
      res.status(201).send({
        success: true,
        message: 'User successfully created',
        userData,
      })
    )
    .catch(error =>
      res.status(400).send({
        success: false,
        error,
      })
    )
}

export const updateUser = (req, res) => {
  res.status(501).send('put user')
}

export const deleteUser = (req, res) => {
  console.log(req.params)
  console.log(req.body)
  const { id } = req.params

  return User.destroy({
    where: {
      id,
    },
  }).then(affectedRows => {
    console.log(affectedRows)
    res.status(200).send({
      success: true,
      deleted: affectedRows,
    })
  })
}
