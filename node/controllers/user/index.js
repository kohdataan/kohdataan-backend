import bcrypt from 'bcrypt'
import model from '../../models'
import fs from 'fs'

const { User } = model

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
      user
    })
  )
  
}

export const addUser = async (req, res) => {
  const { username, email, password, nickname, description, profileReady } = req.body
  const hashed = bcrypt.hashSync(password, 12)

  return User.create({
    username,
    email,
    password: hashed,
    nickname,
    description,
    profileReady
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
  const { username, email, nickname, description, profileReady } = req.body
  const sessionUsername = req.user.dataValues.username
  if (username === sessionUsername) {
    User.update({
      username,
      email,
      nickname,
      description,
      profileReady
    }, {
      where: {
        username
      }
    })
      .then(rows => {
        console.log("rows",rows)
        res.status(200).send()
      })
      .catch(error =>
        res.status(400).send({
          success: false,
          error,
        })
      )
  }
  else {
    res.status(401).send("Action forbidden")
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
