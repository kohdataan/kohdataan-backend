import bcrypt from 'bcrypt'
import rp from 'request-promise'
import { Client4 } from 'mattermost-redux/client'
import model from '../../models'

const { User } = model
Client4.setUrl('http://mattermost:8000')

export const getUsers = (req, res) => {
  return User.findAll().then(users =>
    res.status(200).send({
      users,
    })
  )
}

export const getUser = (req, res) => {
  const { id } = req.params

  return User.findByPk(id).then(user =>
    res.status(200).send({
      nickname: user.username,
      location: user.location,
      description: user.description,
    })
  )
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

  return User.create({
    username,
    email,
    password: hashed,
    nickname,
    location,
    description,
    profileReady,
    tutorialWatched,
  })
    .then(async () => {
      try {
        const response = await rp({
          method: 'POST',
          uri: 'http://localhost:9090/api/v4/users',
          body: {
            username,
            email,
            password,
          },
          json: true,
        })
        return response
      } catch (err) {
        User.destroy({
          where: {
            email,
          },
        })
        return Promise.reject(err)
      }
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
        res.status(400).send({
          success: false,
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
  }).then(affectedRows => {
    res.status(200).send({
      success: true,
      deleted: affectedRows,
    })
  })
}
