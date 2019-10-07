import model from '../models'

const { user } = model

beforeAll(() => {
  return model.sequelize.sync({
    force: true,
  })
})

describe('Sample Test', () => {
  test('should test that true === true', () => {
    expect(true).toBe(true)
  })

  test('connection to database is established', () => {
    model.sequelize
      .authenticate()
      .then(() => {
        expect(true).toBe(true)
      })
      .catch(() => {
        expect(true).toBe(false)
      })
  })
})
