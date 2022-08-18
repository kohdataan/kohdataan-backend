import model from '../../models/index.js'

const { Interest } = model

export const getInterests = (req, res) => {
  return Interest.findAll({ attributes: ['id', 'name'] }).then(results =>
    res.status(200).send({
      success: true,
      message: 'User interests fetched',
      results,
    })
  )
}

export const getInterest = (req, res) => {
  res.status(501).send('get interest')
}

export const addInterest = (req, res) => {
  res.status(501).send('add interest')
}

export const updateInterest = (req, res) => {
  res.status(501).send('put interest')
}

export const deleteInterest = (req, res) => {
  res.status(501).send('delete interest')
}
