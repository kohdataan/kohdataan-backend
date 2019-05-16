import bcrypt from 'bcrypt'
import axios from 'axios'
import model from '../../models'

const { User } = model
const mattermostUrl = 'http://mattermost:8000/api/v4'
/* Client4.setUrl(mattermostUrl)
Client4.login('kalevi', 'einari')
  .then(result => console.log(result))
  .catch(err => console.log(err))
*/
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
  return User.create(user)
    .then(async () => {
      try {
        axios.defaults.headers.common['Authorization'] = 'Bearer prriipraa'
        const result = await axios.post(`${mattermostUrl}/users`, {
          username,
          email,
          password,
        })
        return result
      } catch (err) {
        User.destroy({
          where: {
            email,
          },
        })
        console.log(err)
        return Promise.reject(JSON.stringify(err))
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
