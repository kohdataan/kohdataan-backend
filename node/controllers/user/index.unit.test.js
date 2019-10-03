const SequelizeMock = require('sequelize-mock')

const dbMock = new SequelizeMock()
const userMock = dbMock.define('user', {
  username: 'test',
  email: 'test@test.com',
  password: 'kissa',
  nickname: 'test',
  location: 'kerava',
  description: 'guy that is test',
  profileReady: true,
  tutorialWatched: true,
})
