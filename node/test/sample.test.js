import model from '../models'

const { User } = model

test('connection to database is established', () => {
  return model.sequelize.authenticate().then(() => {
    expect(true).toBe(true)
  })
})

test('user is created and atleast one user is found', () => {
  const testUser = {
    username: 'test',
    email: 'test@gmail.com',
    password: 'testtest',
    nickname: 'test',
    location: 'kerava',
    description: 'moi',
    profileReady: true,
    tutorialWatched: true,
  }

  return User.create(testUser).then(() => {
    return User.findAll().then(users => {
      expect(users.length).toBeGreaterThan(0)
    })
  })
})
