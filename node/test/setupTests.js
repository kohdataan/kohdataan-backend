import model from '../models/index.js'

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
