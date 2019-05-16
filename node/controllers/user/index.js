import bcrypt from 'bcrypt'
import axios from 'axios'
import model from '../../models'

const { User } = model
const mattermostUrl = 'http://mattermost:8000/api/v4'

export const getUsers = (req, res) => {
  return User.findAll()
    .then(users =>
      res.status(200).send({
        users,
      })
    )
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Error getting users',
        error: err,
      })
    })
}

export const getUser = (req, res) => {
  const { id } = req.params

  return User.findByPk(id)
    .then(user =>
      res.status(200).send({
        nickname: user.username,
        location: user.location,
        description: user.description,
      })
    )
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Error getting user',
        error: err,
      })
    })
}

export const addUser = async (req, res) => {
  const {
    username,
    email,
    password,
    nickname,
    location,
    description,
    profileReady,
    tutorialWatched,
  } = req.body
  const hashed = bcrypt.hashSync(password, 12)
  const user = {
    username,
    email,
    password: hashed,
    nickname,
    location,
    description,
    profileReady,
    tutorialWatched,
  }

  User.create(user)
    .then(async results => {
      const results2 = await axios.post(`${mattermostUrl}/users`, {
        username,
        email,
        password,
      })
      return [results, results2]
    })
    .then(([results, results2]) => {
      const mmuser = results2.data
      res.status(201).send({
        success: true,
        message: 'User successfully created',
        results: {
          username: results.username,
          email: results.email,
          nickname: results.nickname,
        },
        mmuser,
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Error in creating a user',
        error: err,
      })
    })
}

export const updateUser = (req, res) => {
  const {
    username,
    email,
    nickname,
    location,
    description,
    profileReady,
    tutorialWatched,
  } = req.body
  const { id } = req.user.dataValues
  const queryId = req.params.id
  // eslint-disable-next-line radix
  if (parseInt(id) !== parseInt(queryId)) {
    res.status(401).send({
      success: false,
      message: 'Action forbidden',
    })
  } else {
    User.update(
      {
        username,
        email,
        nickname,
        location,
        description,
        profileReady,
        tutorialWatched,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(rows =>
        res.status(200).send({
          success: true,
          message: 'User succesfully updated',
          updated: rows,
        })
      )
      .catch(error =>
        res.status(500).send({
          success: false,
          message: 'Error in updating user',
          error,
        })
      )
  }
}

export const deleteUser = (req, res) => {
  const { id } = req.params

  return User.destroy({
    where: {
      id,
    },
  })
    .then(affectedRows => {
      res.status(200).send({
        success: true,
        deleted: affectedRows,
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Error deleting users',
        error: err,
      })
    })
}
