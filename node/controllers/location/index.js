import locations from './locations.json' assert { type: 'json' }

// eslint-disable-next-line import/prefer-default-export
export const getLocations = (_req, res) => {
  return res.status(200).json(locations)
}
