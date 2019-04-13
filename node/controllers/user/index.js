exports.getUsers = (req, res, next) => {
  res.status(501).send('get all users');
};

exports.getUser = (req, res, next) => {
  res.status(501).send('get user');
};

exports.addUser = (req, res, next) => {
  res.status(501).send('add user');
};

exports.updateUser = (req, res, next) => {
  res.status(501).send('put user');
};

exports.deleteUser = (req, res, next) => {
  res.status(501).send('delete user');
};
