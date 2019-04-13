exports.getUserQuestions = (req, res, next) => {
  res.status(501).send('get all user questions');
};

exports.getUserQuestion = (req, res, next) => {
  res.status(501).send('get user question');
};

exports.addUserQuestion = (req, res, next) => {
  res.status(501).send('add user question');
};

exports.updateUserQuestion = (req, res, next) => {
  res.status(501).send('put user question');
};

exports.deleteUserQuestion = (req, res, next) => {
  res.status(501).send('delete user question');
};
