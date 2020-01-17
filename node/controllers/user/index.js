import bcrypt from 'bcrypt'
import axios from 'axios'
import model from '../../models'

const { User } = model
const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

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
    .then(user => {
      const {
        nickname,
        location,
        description,
        birthdate,
        phoneNumber,
        profileReady,
        tutorialWatched,
        showAge,
        showLocation,
        emailVerified,
      } = user
      res.status(200).send({
        nickname,
        location,
        description,
        birthdate,
        phoneNumber,
        profileReady,
        tutorialWatched,
        showAge,
        showLocation,
        emailVerified,
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Error getting user',
        error: err,
      })
    })
}

export const getUserByUsername = (req, res) => {
  const { username } = req.params

  return User.findAll({
    where: { username },
  })
    .then(user => {
      if (user && user[0]) {
        const {
          id,
          nickname,
          location,
          description,
          birthdate,
          phoneNumber,
          profileReady,
          tutorialWatched,
          showAge,
          showLocation,
          emailVerified,
        } = user[0]
        res.status(200).send({
          id,
          nickname,
          location,
          description,
          birthdate,
          phoneNumber,
          profileReady,
          tutorialWatched,
          showAge,
          showLocation,
          emailVerified,
        })
      } else {
        res.status(404).send({
          success: false,
          message: 'User not found',
        })
      }
    })
    .catch(err => {
      console.log(err)
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
    first_name,
    last_name,
    birthdate,
    phoneNumber,
    nickname,
    location,
    description,
    profileReady,
    tutorialWatched,
    showAge,
    showLocation,
    emailVerified,
  } = req.body
  const hashed = bcrypt.hashSync(password, 12)
  const user = {
    username,
    email,
    password: hashed,
    birthdate,
    phoneNumber,
    nickname,
    location,
    description,
    profileReady,
    tutorialWatched,
    showAge,
    showLocation,
    emailVerified,
  }

  User.create(user)
    .then(async results => {
      const results2 = await axios.post(`${mattermostUrl}/users`, {
        username,
        email,
        password,
        first_name,
        last_name,
        nickname,
      })
      return [results, results2]
    })
    .then(async ([results, results2]) => {
      const mmuser = results2.data
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
      const results3 = await axios.post(
        `${mattermostUrl}/teams/${process.env.TEAM_ID}/members`,
        {
          team_id: process.env.TEAM_ID,
          user_id: mmuser.id,
        }
      )
      return [results, results2, results3]
    })
    .then(([results, results2, results3]) => {
      const mmuser = results2.data
      const team = results3.data
      res.status(201).send({
        success: true,
        message: 'User successfully created',
        results: {
          username: results.username,
          email: results.email,
          nickname: results.nickname,
          birthdate: results.birthdate,
          phoneNumber: results.phoneNumber,
        },
        mmuser,
        team,
      })
      return results
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        success: false,
        message: 'Error in creating a user',
        error: err,
      })
    })
}

export const updateMattermostUser = async (mmid, nickname, email) => {
  axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
  const newData = { nickname, email }
  return await axios.put(`${mattermostUrl}/users/${mmid}/patch`, {
    ...newData,
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
    showAge,
    showLocation,
    emailVerified,
    phoneNumber,
    mmid,
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
        showAge,
        showLocation,
        emailVerified,
        phoneNumber,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(rows => {
        if (mmid) {
          return updateMattermostUser(mmid, nickname, email)
        }
        return rows
      })
      .then(rows => {
        const updated = rows && rows.data ? rows.data : rows
        return res.status(200).send({
          success: true,
          message: 'User succesfully updated',
          updated,
        })
      })
      .catch(error => {
        console.log(error)
        res.status(500).send({
          success: false,
          message: 'Error in updating user',
          error,
        })
      })
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
