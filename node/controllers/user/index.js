import bcrypt from 'bcrypt'
import axios from 'axios'
import model from '../../models'
import uuidv4 from 'uuid/v4'

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
        first_name,
        last_name,
        location,
        description,
        birthdate,
        phoneNumber,
        profileReady,
        tutorialWatched,
        showAge,
        showLocation,
        deleteAt,
        emailVerified,
        channelInvitationsAt,
      } = user
      res.status(200).send({
        nickname,
        first_name,
        last_name,
        location,
        description,
        birthdate,
        phoneNumber,
        profileReady,
        tutorialWatched,
        showAge,
        showLocation,
        deleteAt,
        emailVerified,
        channelInvitationsAt,
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
          deleteAt,
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
          deleteAt,
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
  }
  try {
    // create node-user
    const nodeUser = await User.create(user)
    // Create mmuser
    const mmresp = await axios.post(`${mattermostUrl}/users`, {
      username,
      email,
      password,
      first_name,
      last_name,
      nickname,
    })
    // Add user to team
    const mmuser = mmresp.data
    axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
    const mmTeamResp = await axios.post(
      `${mattermostUrl}/teams/${process.env.TEAM_ID}/members`,
      {
        team_id: process.env.TEAM_ID,
        user_id: mmuser.id,
      }
    )
    const team = mmTeamResp.data
    // Send created response
    res.status(201).send({
      success: true,
      message: 'User successfully created',
      results: {
        username: nodeUser.username,
        email: nodeUser.email,
        nickname: nodeUser.nickname,
        birthdate: nodeUser.birthdate,
        phoneNumber: nodeUser.phoneNumber,
      },
      mmuser,
      team,
    })
  } catch (e) {
    if (e && e.name == 'SequelizeUniqueConstraintError') {
      // There was problem while creating node-user
      res.status(500).send({
        success: false,
        message: 'Error in creating node-user',
        error: e,
      })
    } else if (
      e &&
      e.response &&
      e.response.data &&
      e.response.data.id === 'store.sql_user.save.email_exists.app_error'
    ) {
      // There was a problem when creating mmuser => delete created node-user and rollback
      await User.destroy({
        where: {
          email,
        },
      })
      res.status(500).send({
        success: false,
        message: 'Error in creating mattermost-user',
        error: e.response && e.response.data,
      })
    } else {
      // Some other error occurred
      res.status(500).send({
        success: false,
        message: 'Something went wrong while creating user',
        error: e.response,
      })
    }
  }
}

export const updateMattermostUser = async (mmid, nickname, email) => {
  axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
  const newData = { username, nickname, email }
  return await axios.put(`${mattermostUrl}/users/${mmid}/patch`, {
    ...newData,
  })
}

export const updateUser = (req, res) => {
  const {
    username,
    email,
    first_name,
    last_name,
    nickname,
    location,
    description,
    profileReady,
    tutorialWatched,
    showAge,
    showLocation,
    emailVerified,
    phoneNumber,
    channelInvitationsAt,
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
        first_name,
        last_name,
        location,
        description,
        profileReady,
        tutorialWatched,
        showAge,
        showLocation,
        emailVerified,
        phoneNumber,
        channelInvitationsAt,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(rows => {
        if (mmid) {
          return updateMattermostUser(mmid, username, nickname, email)
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

export const deleteUserImmediately = async (req, res) => {
  // This can be used to go through node users in CRON job etc. and if
  // deleteAt timestamp is more than (for example) 7 days ago, then call
  // this to actually permanently delete the user and related mattermost user
  try {
    const { id } = req.params
    const { mmid } = req.body

    if (id && mmid) {
      // Deactivate also mattermost user
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
      // First change email so that current email will be available for new user
      const randomEmail = `${uuidv4()}@deleted.fi`
      await updateMattermostUser(mmid, null, randomEmail)
      // Deactivate mattermost user
      await axios.delete(`${mattermostUrl}/users/${mmid}`)
      // Only after mattermost user is successfully deactivated, delete also node-user
      const affectedRows = await User.destroy({
        where: {
          id,
        },
      })
      res.status(200).send({
        success: true,
        deleted: affectedRows,
      })
    } else {
      res.status(400).send({
        success: false,
        message:
          'Missing parameters in request. Both id and mmid are rqeuired.',
      })
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Error deleting users',
      error: e,
    })
  }
}

export const deleteUser = async (req, res) => {
  // This only adds deleteAt timestamp to node-user
  const { id } = req.params
  try {
    // Add deleteAt timestamp to user
    const affectedRows = await User.update(
      {
        deleteAt: Date.now(),
      },
      {
        where: {
          id,
        },
      }
    )
    res.status(200).send({
      success: true,
      deleted: affectedRows,
    })
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Error deleting user',
      error: e,
    })
  }
}

export const abortDeleteUser = async (req, res) => {
  // This removes the deleteAt timestamp from node-user
  const { id } = req.params
  try {
    const affectedRows = await User.update(
      {
        deleteAt: null,
      },
      {
        where: {
          id,
        },
      }
    )
    res.status(200).send({
      success: true,
      restored: affectedRows,
    })
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Error deleting user',
      error: e,
    })
  }
}
