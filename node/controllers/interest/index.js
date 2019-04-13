exports.getInterests = (req, res, next) => {
  res.status(501).send('get all interests');
};

exports.getInterest = (req, res, next) => {
  res.status(501).send('get interest');
};

exports.addInterest = (req, res, next) => {
  res.status(501).send('add interest');
};

exports.updateInterest = (req, res, next) => {
  res.status(501).send('put interest');
};

exports.deleteInterest = (req, res, next) => {
  res.status(501).send('delete interest');
};
