import model from '../models'

beforeAll(() => {
  model.sequelize
    .sync({
      force: true,
      logging: false,
    })
    .finally(() => {
      model.sequelize.close()
    })
})
