exports.getUserInterests = (req, res, next) => {
  res.status(501).send('get all user interests');
};

exports.getUserInterest = (req, res, next) => {
  res.status(501).send('get user interest');
};

exports.addUserInterest = (req, res, next) => {
  res.status(501).send('add user interest');
};

exports.updateUserInterest = (req, res, next) => {
  res.status(501).send('put user interest');
};

exports.deleteUserInterest = (req, res, next) => {
  res.status(501).send('delete user interest');
};
